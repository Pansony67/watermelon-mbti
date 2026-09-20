import { neon } from "@neondatabase/serverless";
import type { Answer } from "./questions";

// Built per call so a missing DATABASE_URL fails the query, not the import.
const sql = () => neon(process.env.DATABASE_URL!);

export async function countResponses(): Promise<number> {
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

/** Each result type's share of all scored responses, as a 0-100 percentage. */
export async function resultBreakdown(): Promise<{ total: number; shares: Record<string, number> }> {
  const rows = (await sql()`
    SELECT result_type, COUNT(*)::int AS count
    FROM quiz_responses WHERE result_type IS NOT NULL
    GROUP BY result_type
  `) as { result_type: string; count: number }[];
  const total = rows.reduce((n, r) => n + r.count, 0);
  const shares = Object.fromEntries(rows.map((r) => [r.result_type, Math.round((r.count / total) * 100)]));
  return { total, shares };
}
