import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { haveIBeenPwned } from "better-auth/plugins";
import { Pool } from "pg";
import { PASSWORD_MAX, PASSWORD_MIN, PROVIDERS, type ProviderId } from "./auth-rules";

/**
 * Accounts, via Better Auth (https://www.better-auth.com), stored in the same
 * Postgres as the quiz. Tables are created by `npm run db:migrate`.
 *
 * Environment (see README):
 *   DATABASE_URL          the Neon connection string
 *   BETTER_AUTH_SECRET    32+ random bytes; signs session cookies
 *   BETTER_AUTH_URL       the site's own URL, e.g. https://watermelon-mbti.vercel.app
 *   GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET, FACEBOOK_..., LINE_...  one pair per social provider
 *
 * What Better Auth already does for us, checked against its source:
 *   - passwords hashed with scrypt, never stored in plain text
 *   - a wrong email and a wrong password get the same error, and an unknown
 *     email still costs one hash, so neither message nor timing reveals who
 *     has an account
 *   - session cookies are HttpOnly, SameSite=Lax, and Secure over https
 *   - requests from other origins are rejected (CSRF)
 */

/** A provider is switched on only when both of its credentials are set. */
const credentials = (id: ProviderId) => {
  const clientId = process.env[`${id.toUpperCase()}_CLIENT_ID`];
  const clientSecret = process.env[`${id.toUpperCase()}_CLIENT_SECRET`];
  return clientId && clientSecret ? { clientId, clientSecret } : null;
};

export const enabledProviders = PROVIDERS.map((p) => p.id).filter((id) => credentials(id));

export const auth = betterAuth({
  appName: "Melonality",
  // Without DATABASE_URL (local development) Better Auth keeps accounts in memory, so sign-in
  // still works on your machine; they reset when the dev server restarts. Production always has it.
  database: process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL }) : undefined,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: PASSWORD_MIN,
    maxPasswordLength: PASSWORD_MAX,
    autoSignIn: true,
  },
  // "Delete account" in the nav menu. Without a password it needs a session under a day old, so a
  // borrowed, long-open laptop can't delete someone's account.
  user: { deleteUser: { enabled: true } },
  socialProviders: Object.fromEntries(enabledProviders.map((id) => [id, credentials(id)!])),
  rateLimit: {
    // Counted in the database so the limit holds across serverless instances.
    storage: "database",
    // Roomy enough that a person fixing typos never meets them; a script still does. Passwords
    // are long and breach-checked, so guessing is hopeless well before this. Starting a Google,
    // Facebook or LINE sign-in takes no password, so it gets more (Better Auth's default for
    // every /sign-in path is 3 per 10 seconds, which a double-click and one retry use up).
    customRules: {
      "/sign-in/email": { window: 60, max: 10 },
      "/sign-up/email": { window: 60, max: 10 },
      "/sign-in/social": { window: 60, max: 20 },
    },
  },
  plugins: [
    // Refuses passwords seen in data breaches at sign-up. Only the first 5 characters of
    // the password's SHA-1 hash leave the server (k-anonymity), never the password.
    haveIBeenPwned({ customPasswordCompromisedMessage: "That password has shown up in a data breach. Pick another one." }),
    // Must stay last: lets Server Actions set the session cookie.
    nextCookies(),
  ],
});
