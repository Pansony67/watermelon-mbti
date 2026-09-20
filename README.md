# Watermelon MBTI

A free personality quiz: twenty statements, ten watermelon types. Next.js 16 (App Router), TypeScript, Tailwind v4, react-three-fiber, Neon Postgres.

## Run locally

```bash
npm install
echo 'DATABASE_URL=postgres://…neon.tech/…?sslmode=require' > .env.local
npm run db:migrate   # creates / updates the quiz_responses table (idempotent)
npm run dev
```

The site works without a database; the landing count tile and the results page's stats simply don't render until one is configured.

## Before launch

- Fill in `contactEmail` and `jurisdiction` in `lib/legal.ts` (Privacy and Terms read from it).
- Set `DATABASE_URL` in the Vercel project and run `npm run db:migrate` against it once.

## Checks

```bash
npm run lint
npx tsx --test lib/scoring.test.ts
npm run build
```

## Layout

- `app/` routes: landing, `/quiz`, `/quiz/results`, `/privacy`, `/terms`, API routes under `app/api`
- `components/` UI, including the 3D melon (`Watermelon3D.tsx`) and the quiz flow
- `lib/` questions, scoring, result copy, database access, operator details
- `scripts/db-migrate.mjs` schema
