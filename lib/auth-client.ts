import { createAuthClient } from "better-auth/react";

/** Browser-side auth: sign in, sign up, sign out and the current session. Talks to /api/auth. */
export const authClient = createAuthClient();
