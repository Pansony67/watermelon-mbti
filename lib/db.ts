import { neon } from "@neondatabase/serverless";
import type { Answer } from "./questions";
import { TYPES } from "./types";

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

/** Inserts one result and returns its deletion token. */
export async function insertResponse(answers: readonly Answer[], resultType: string): Promise<string> {
  // Stringified: the driver would otherwise send a JS array as a Postgres array, not JSON.
  const [row] = await sql()`
    INSERT INTO quiz_responses (answers, result_type)
    VALUES (${JSON.stringify(answers)}::jsonb, ${resultType})
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
 * Each current type's share of responses scored with the current types, as a
 * 0-100 percentage. Rows saved under the retired 10-type system are left out,
 * so they neither count toward any type nor dilute the percentages.
 */
export async function resultBreakdown(): Promise<{ total: number; shares: Record<string, number> }> {
  const slugs = TYPES.map((type) => type.slug);
  const rows = (await sql()`
    SELECT result_type, COUNT(*)::int AS count
    FROM quiz_responses WHERE result_type = ANY(${slugs}::text[])
    GROUP BY result_type
  `) as { result_type: string; count: number }[];
  const total = rows.reduce((n, r) => n + r.count, 0);
  const shares = Object.fromEntries(rows.map((r) => [r.result_type, Math.round((r.count / total) * 100)]));
  return { total, shares };
}
