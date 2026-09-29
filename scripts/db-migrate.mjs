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

// Accounts (lib/auth.ts). Generated with `npx auth generate` for better-auth 1.7; if Better Auth
// is upgraded, re-generate and add any new columns here as ALTER TABLE ... ADD COLUMN IF NOT EXISTS.
const AUTH_SCHEMA = [
  `CREATE TABLE IF NOT EXISTS "user" ("id" text NOT NULL PRIMARY KEY, "name" text NOT NULL, "email" text NOT NULL UNIQUE, "emailVerified" boolean NOT NULL, "image" text, "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, "updatedAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS "session" ("id" text NOT NULL PRIMARY KEY, "expiresAt" timestamptz NOT NULL, "token" text NOT NULL UNIQUE, "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, "updatedAt" timestamptz NOT NULL, "ipAddress" text, "userAgent" text, "userId" text NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS "account" ("id" text NOT NULL PRIMARY KEY, "accountId" text NOT NULL, "providerId" text NOT NULL, "userId" text NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE, "accessToken" text, "refreshToken" text, "idToken" text, "accessTokenExpiresAt" timestamptz, "refreshTokenExpiresAt" timestamptz, "scope" text, "password" text, "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, "updatedAt" timestamptz NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS "verification" ("id" text NOT NULL PRIMARY KEY, "identifier" text NOT NULL, "value" text NOT NULL, "expiresAt" timestamptz NOT NULL, "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, "updatedAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS "rateLimit" ("id" text NOT NULL PRIMARY KEY, "key" text NOT NULL UNIQUE, "count" integer NOT NULL, "lastRequest" bigint NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session" ("userId")`,
  `CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account" ("userId")`,
  `CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification" ("identifier")`,
];
for (const statement of AUTH_SCHEMA) await sql.query(statement);
console.log("auth tables ready");
