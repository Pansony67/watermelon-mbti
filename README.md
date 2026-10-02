# Melonality

> The repo, Vercel project and URL (watermelon-mbti.vercel.app) keep the original name on purpose: Search Console verification and the submitted sitemap are tied to that URL.

A free personality quiz: twenty statements, twenty watermelon types. Next.js 16 (App Router), TypeScript, Tailwind v4, react-three-fiber, Neon Postgres.

## Run locally

```bash
npm install
echo 'DATABASE_URL=postgres://…neon.tech/…?sslmode=require' > .env.local
echo "BETTER_AUTH_SECRET=$(openssl rand -base64 32)" >> .env.local
echo 'BETTER_AUTH_URL=http://localhost:3000' >> .env.local
npm run db:migrate   # creates / updates the quiz and account tables (idempotent)
npm run dev
```

The site works without a database; the landing count tile and the results page's stats simply don't render until one is configured.

## Accounts

Optional sign-in (`/sign-in`) via [Better Auth](https://www.better-auth.com), stored in the same Postgres. Visitors who don't sign in are shown as Guest. Config is in `lib/auth.ts`, rules in `lib/auth-rules.ts`.

Environment variables (Vercel: Project, Settings, Environment Variables):

| Variable | Value |
|---|---|
| `BETTER_AUTH_SECRET` | 32+ random bytes, e.g. `openssl rand -base64 32`. Signs session cookies; never commit it. |
| `BETTER_AUTH_URL` | `https://watermelon-mbti.vercel.app` |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google Cloud Console, APIs & Services, Credentials, OAuth client (Web). |
| `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET` | developers.facebook.com, your app, Facebook Login. App ID and App Secret. |
| `LINE_CLIENT_ID`, `LINE_CLIENT_SECRET` | developers.line.biz, a LINE Login channel. Channel ID and Channel secret. |

Each social button appears only once both of its variables are set. When creating each app, the redirect / callback URL is `https://watermelon-mbti.vercel.app/api/auth/callback/<google|facebook|line>` (add the `http://localhost:3000/...` versions for local testing).

Passwords follow OWASP and NIST SP 800-63B-4: 15+ characters, up to 128, no composition rules, and breached passwords (Have I Been Pwned) refused. Sign-in and sign-up are rate-limited per IP.

## Before launch

- Fill in `contactEmail` and `jurisdiction` in `lib/legal.ts` (Privacy and Terms read from it).
- Set `DATABASE_URL` in the Vercel project and run `npm run db:migrate` against it (again after this update: it adds the account tables).
- Set `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` in Vercel, plus the keys for any social sign-in you want (see Accounts).

## Checks

```bash
npm run lint
npx tsx --test lib/scoring.test.ts lib/types.test.ts
npx tsx scripts/simulate-quiz.ts   # balance: share of each family and type for simulated players
npm run build
```

## Layout

- `app/` routes: landing, `/quiz`, `/quiz/results`, `/types`, `/types/[slug]`, `/how-it-works`, `/about`, `/sign-in`, `/privacy`, `/terms`, API routes under `app/api`
- `components/` UI, including the 3D melon (`Watermelon3D.tsx`) and the quiz flow
- `lib/` questions, scoring, types, database access, auth, operator details
- `scripts/db-migrate.mjs` schema (runs before every build)
- `scripts/simulate-quiz.ts` balance check for the branching quiz
