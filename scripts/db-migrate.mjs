// One-shot schema. Idempotent: safe to re-run. `npm run db:migrate`
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

// One statement per call: Neon's HTTP endpoint rejects multi-statement queries.
await sql.query(`
  CREATE TABLE IF NOT EXISTS quiz_responses (
    id         serial PRIMARY KEY,
    created_at timestamptz NOT NULL DEFAULT now()
  )
`);
await sql.query(`ALTER TABLE quiz_responses ADD COLUMN IF NOT EXISTS answers jsonb`);
await sql.query(`ALTER TABLE quiz_responses ADD COLUMN IF NOT EXISTS result_type text`);
// Unguessable per-row token: the only way to delete a row, since rows carry no identity.
await sql.query(`ALTER TABLE quiz_responses ADD COLUMN IF NOT EXISTS delete_token uuid NOT NULL DEFAULT gen_random_uuid()`);
console.log("quiz_responses ready");
