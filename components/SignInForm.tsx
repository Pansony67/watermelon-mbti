"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeSlash, WarningCircle } from "@phosphor-icons/react";
import BrandMark from "@/components/BrandMark";
import { authClient } from "@/lib/auth-client";
import { PASSWORD_MAX, PASSWORD_MIN, PROVIDERS, type ProviderId } from "@/lib/auth-rules";

type Mode = "sign-in" | "sign-up";
type Problem = { title: string; body: string };

/**
 * Better Auth error codes to the site's voice. A wrong email and a wrong
 * password share one code and one message on purpose (no account guessing).
 */
function explain(error: { code?: string; status: number }): Problem {
  if (error.status === 429) return { title: "Too many tries.", body: "Take a breath and try again in a minute." };
  switch (error.code) {
    case "INVALID_EMAIL_OR_PASSWORD":
      return { title: "Melon knows passwords stronger than you.", body: "That email and password don't match. Try again." };
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
      return { title: "That email already has an account.", body: "Sign in instead, or use another email." };
    case "PASSWORD_TOO_SHORT":
      return { title: "Too short for Melon.", body: `Use at least ${PASSWORD_MIN} characters. A few random words works great.` };
    case "PASSWORD_TOO_LONG":
      return { title: "That one's a novel.", body: `Keep it under ${PASSWORD_MAX} characters.` };
    case "PASSWORD_COMPROMISED":
      return { title: "That password has leaked before.", body: "It showed up in a data breach, so Melon won't take it. Pick another one." };
    case "INVALID_EMAIL":
      return { title: "That email doesn't look right.", body: "Check it and try again." };
    default:
      return { title: "Something went wrong on our side.", body: "Please try again in a moment." };
  }
}

const FIELD =
  "mt-2 block h-12 w-full rounded-control bg-paper px-4 text-base text-ink ring-1 ring-line ring-inset transition-shadow duration-300 placeholder:text-ink-3 focus:ring-2 focus:ring-flesh focus:outline-none";

export default function SignInForm({
  initialMode,
  enabled,
  showUnconfigured,
  character,
}: {
  initialMode: Mode;
  /** Social providers with credentials set on the server. */
  enabled: ProviderId[];
  /** In development, show providers that still need credentials, disabled, so the layout can be reviewed. */
  showUnconfigured: boolean;
  character: { name: string; image: string };
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);
  const [pending, setPending] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);

  const signingUp = mode === "sign-up";
  const providers = PROVIDERS.filter((p) => enabled.includes(p.id) || showUnconfigured);

  const switchMode = (next: Mode) => {
    setMode(next);
    setProblem(null);
    window.history.replaceState(null, "", next === "sign-up" ? "/sign-in?mode=sign-up" : "/sign-in");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setProblem(null);
    // Friendly early checks; the server enforces the same rules regardless.
    if (signingUp && !name.trim()) return setProblem({ title: "What should Melon call you?", body: "Add a name for your pass." });
    if (!email.trim() || !password) return setProblem({ title: "Almost.", body: "Fill in your email and password." });
    if (signingUp && password.length < PASSWORD_MIN) return setProblem(explain({ code: "PASSWORD_TOO_SHORT", status: 400 }));

    setPending(true);
    const { error } = signingUp
      ? await authClient.signUp.email({ name: name.trim(), email: email.trim(), password })
      : await authClient.signIn.email({ email: email.trim(), password });
    setPending(false);
    if (error) {
      setProblem(explain(error));
      // Never leave a wrong password sitting in the field.
      if (error.code === "INVALID_EMAIL_OR_PASSWORD") setPassword("");
      return;
    }
    router.push("/");
    router.refresh();
  };

  const social = async (provider: ProviderId) => {
    setProblem(null);
    const { error } = await authClient.signIn.social({ provider, callbackURL: "/" });
    if (error) setProblem(explain(error));
  };

  return (
    <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:gap-16">
      <div className="w-full">
        <MelonPass holder={signingUp ? name.trim() : ""} joining={signingUp} character={character} compact />

        <h1 className="font-display text-4xl leading-tight font-semibold tracking-[-0.01em] text-ink sm:text-5xl">
          {signingUp ? "Get your pass" : "Welcome back"}
        </h1>
        <p className="mt-3 text-ink-2">
          {signingUp ? "Create an account, or keep playing as a Guest." : "Sign in to your Melonality pass."}
        </p>

        {providers.length > 0 && (
          <>
            <div className="mt-8 grid gap-3">
              {providers.map((provider) => {
                const ready = enabled.includes(provider.id);
                return (
                  <button
                    key={provider.id}
                    type="button"
                    disabled={!ready || pending}
                    onClick={() => social(provider.id)}
                    className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-control bg-paper text-[15px] font-semibold text-ink ring-1 ring-line ring-inset transition-colors duration-300 hover:bg-paper-2 focus-visible:ring-2 focus-visible:ring-flesh focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <BrandMark provider={provider.id} />
                    Continue with {provider.label}
                    {!ready && <span className="text-xs font-medium text-ink-3">(needs setup)</span>}
                  </button>
                );
              })}
            </div>
            <div className="my-7 flex items-center gap-4 text-sm text-ink-3">
              <span className="h-px flex-1 bg-line" />
              or with email
              <span className="h-px flex-1 bg-line" />
            </div>
          </>
        )}

        <form onSubmit={submit} noValidate className={providers.length ? "" : "mt-8"}>
          <div className="grid gap-5">
            {signingUp && (
              <label className="block text-sm font-semibold text-ink">
                Name
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={60}
                  className={FIELD}
                />
              </label>
            )}
            <label className="block text-sm font-semibold text-ink">
              Email
              <input
                type="email"
                name="email"
                autoComplete={signingUp ? "email" : "username"}
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={FIELD}
              />
            </label>
            <div>
              <label htmlFor="password" className="flex items-baseline justify-between text-sm font-semibold text-ink">
                Password
                {signingUp && (
                  <span className={`text-xs font-medium tabular-nums ${password.length >= PASSWORD_MIN ? "text-flesh-deep" : "text-ink-3"}`}>
                    {password.length}/{PASSWORD_MIN}
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={reveal ? "text" : "password"}
                  name="password"
                  autoComplete={signingUp ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={PASSWORD_MAX}
                  aria-describedby={signingUp ? "password-hint" : undefined}
                  className={`${FIELD} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setReveal((r) => !r)}
                  aria-label={reveal ? "Hide password" : "Show password"}
                  aria-pressed={reveal}
                  className="absolute top-2 right-0 grid h-12 w-12 cursor-pointer place-items-center text-ink-3 transition-colors hover:text-ink focus-visible:text-ink focus-visible:outline-none"
                >
                  {reveal ? <EyeSlash size={20} aria-hidden /> : <Eye size={20} aria-hidden />}
                </button>
              </div>
              {signingUp && (
                <p id="password-hint" className="mt-2 text-sm text-ink-3">
                  At least {PASSWORD_MIN} characters. Try a few random words, like &ldquo;rind seed summer picnic&rdquo;.
                </p>
              )}
            </div>
          </div>

          {problem && (
            <div role="alert" className="mt-6 flex gap-3 rounded-control bg-blush px-4 py-3 text-sm">
              <WarningCircle size={20} weight="fill" aria-hidden className="mt-px shrink-0 text-flesh" />
              <p>
                <span className="block font-semibold text-ink">{problem.title}</span>
                <span className="text-ink-2">{problem.body}</span>
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-7 inline-flex h-14 w-full cursor-pointer items-center justify-between rounded-control bg-ink py-2 pr-2 pl-6 font-display text-lg font-semibold text-paper shadow-card transition-colors duration-300 hover:bg-ink/85 focus-visible:ring-2 focus-visible:ring-flesh focus-visible:ring-offset-4 focus-visible:outline-none disabled:cursor-wait disabled:opacity-70"
          >
            {pending ? (signingUp ? "Making your pass..." : "Checking with Melon...") : signingUp ? "Create account" : "Sign in"}
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-flesh text-paper">
              <ArrowRight size={18} weight="bold" aria-hidden />
            </span>
          </button>
        </form>

        {signingUp && (
          <p className="mt-4 text-xs leading-relaxed text-ink-3">
            By creating an account you agree to the{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-ink">Terms</Link> and{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">Privacy Policy</Link>.
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line pt-6 text-sm">
          <button
            type="button"
            onClick={() => switchMode(signingUp ? "sign-in" : "sign-up")}
            className="inline-flex min-h-11 cursor-pointer items-center text-ink-2 hover:text-ink"
          >
            {signingUp ? "Have a pass?" : "New here?"}
            <span className="ml-1.5 font-semibold text-ink underline underline-offset-4">
              {signingUp ? "Sign in" : "Create an account"}
            </span>
          </button>
          <Link href="/" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink hover:underline hover:underline-offset-4">
            Continue as Guest
            <ArrowRight size={14} weight="bold" aria-hidden />
          </Link>
        </div>
      </div>

      <MelonPass holder={signingUp ? name.trim() : ""} joining={signingUp} character={character} />
    </div>
  );
}

/**
 * The page's signature: the visitor's pass. It reads "Guest" until a name is
 * typed on the create-account form, then shows that name as it will appear
 * once signed in. Large beside the form on desktop, a slim strip above it on phones.
 */
function MelonPass({
  holder,
  joining,
  character,
  compact = false,
}: {
  holder: string;
  joining: boolean;
  character: { name: string; image: string };
  compact?: boolean;
}) {
  const shown = holder || "Guest";
  const status = joining && holder ? "Joining" : "Guest";

  if (compact) {
    return (
      <div aria-hidden className="mb-8 flex items-center gap-4 rounded-card bg-cine-base py-2 pr-4 pl-2 lg:hidden">
        <Image src={character.image} alt="" width={301} height={250} className="h-14 w-auto" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-[0.14em] text-cine-ink-2 uppercase">Melonality pass</p>
          <p className="truncate font-display text-lg font-semibold text-cine-ink">{shown}</p>
        </div>
        <span className="rounded-control bg-flesh px-2.5 py-1 text-xs font-semibold text-paper">{status}</span>
      </div>
    );
  }

  return (
    <aside
      aria-label="Your Melonality pass"
      className="relative hidden overflow-hidden rounded-panel bg-cine-base p-10 lg:flex lg:min-h-[36rem] lg:items-center lg:justify-center"
    >
      {/* Stage light behind the pass, the same language as the /types character select. */}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_40%,rgb(255_77_109/0.22),transparent_70%)]" />

      <div className="relative w-full max-w-sm -rotate-2 rounded-panel bg-white/5 p-6 shadow-panel ring-1 ring-white/10 transition-transform duration-500 ease-settle hover:rotate-0">
        <span aria-hidden className="absolute inset-x-6 top-0 h-0.75 rounded-b-full bg-flesh" />
        <div className="flex items-center justify-between">
          <p className="font-display text-lg font-semibold text-cine-ink">
            Melon<span className="text-flesh">ality</span>
          </p>
          <p className="text-xs font-semibold tracking-[0.14em] text-cine-ink-2 uppercase">Pass</p>
        </div>

        <div className="mt-6 grid place-items-center rounded-card bg-[radial-gradient(closest-side,rgb(255_77_109/0.28),transparent)] py-4">
          <Image src={character.image} alt="" width={301} height={250} className="h-auto w-56" />
        </div>

        <p className="mt-6 text-xs font-semibold tracking-[0.14em] text-cine-ink-2 uppercase">Holder</p>
        <p className="mt-1 truncate font-display text-3xl font-semibold text-cine-ink" aria-live="polite">
          {shown}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm">
          <span className="text-cine-ink-2">Pictured: {character.name}</span>
          <span className="rounded-control bg-flesh px-2.5 py-1 text-xs font-semibold text-paper">{status}</span>
        </div>
      </div>
    </aside>
  );
}
