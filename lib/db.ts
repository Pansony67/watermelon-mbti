import { neon } from "@neondatabase/serverless";
import type { Answers } from "./quiz";
import type { Result } from "./scoring";
import { FAMILIES, type Family } from "./types";

/**
 * False where DATABASE_URL isn't set (local development; Vercel secrets can't be pulled).
 * Database features then switch off quietly instead of failing: no count tile, results
 * aren't saved, stats stay hidden. Vercel always has it.
 */
export const hasDatabase = Boolean(process.env.DATABASE_URL);

/** What the API routes answer with when there is no database to talk to. */
export const noDatabase = () => Response.json({ error: "No database configured" }, { status: 503 });

const sql = () => neon(process.env.DATABASE_URL!);

export async function countResponses(): Promise<number | null> {
  if (!hasDatabase) return null;
  const [row] = await sql()`SELECT COUNT(*)::int AS count FROM quiz_responses`;
  return row.count;
}

/** Inserts one branching-quiz result (version 2) and returns its deletion token. */
export async function insertResponse(answers: Answers, result: Result): Promise<string> {
  // Stringified so the driver sends JSON, not a Postgres array or record.
  const [row] = await sql()`
    INSERT INTO quiz_responses (quiz_version, answers, result_type, color_family, trait_scores)
    VALUES (2, ${JSON.stringify(answers)}::jsonb, ${result.type.slug}, ${result.family}, ${JSON.stringify(result.traits)}::jsonb)
    RETURNING delete_token
  `;
  return row.delete_token;
}

/** True if a row matched the token and was removed. */
export async function deleteResponse(token: string): Promise<boolean> {
  const rows = await sql()`DELETE FROM quiz_responses WHERE delete_token = ${token}::uuid RETURNING id`;
  return rows.length > 0;
}

/**
 * Each type's and each family's share of branching-quiz results, as 0-100
 * percentages. Version 1 rows (the old linear quiz) are left out, so they
 * neither count toward a type nor dilute the percentages.
 */
export async function resultBreakdown(): Promise<{
  total: number;
  shares: Record<string, number>;
  families: Record<Family, number>;
}> {
  const rows = (await sql()`
    SELECT color_family, result_type, COUNT(*)::int AS count
    FROM quiz_responses WHERE quiz_version = 2
    GROUP BY color_family, result_type
  `) as { color_family: Family; result_type: string; count: number }[];
  const total = rows.reduce((n, r) => n + r.count, 0);
  const share = (count: number) => (total ? Math.round((count / total) * 100) : 0);
  return {
    total,
    shares: Object.fromEntries(rows.map((r) => [r.result_type, share(r.count)])),
    families: Object.fromEntries(
      FAMILIES.map((f) => [f, share(rows.filter((r) => r.color_family === f).reduce((n, r) => n + r.count, 0))]),
    ) as Record<Family, number>,
  };
}
