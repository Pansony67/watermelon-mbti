/**
 * Account rules shared by the server config (lib/auth.ts) and the sign-in form.
 *
 * Passwords follow OWASP's Authentication Cheat Sheet and NIST SP 800-63B-4:
 * a password that is the only factor needs at least 15 characters, at least
 * 64 must be allowed (passphrases, password managers), and no composition
 * rules ("one symbol, one capital") are imposed. Leaked passwords are refused
 * at sign-up instead (Have I Been Pwned, in lib/auth.ts).
 */
export const PASSWORD_MIN = 15;
export const PASSWORD_MAX = 128;

/** Social sign-in options, in the order the buttons appear. */
export const PROVIDERS = [
  { id: "google", label: "Google" },
  { id: "facebook", label: "Facebook" },
  { id: "line", label: "LINE" },
] as const;

export type ProviderId = (typeof PROVIDERS)[number]["id"];
