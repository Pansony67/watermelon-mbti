"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "@phosphor-icons/react";
import BorderBeam from "@/components/BorderBeam";
import QuizBackdrop from "@/components/QuizBackdrop";
import SiteFooter from "@/components/SiteFooter";
import ThemeToggle from "@/components/ThemeToggle";
import { Wordmark } from "@/components/SiteNav";
import Image from "next/image";
import { ANSWERS_STORAGE_KEY, isAnswerSet, type Trait } from "@/lib/questions";
import { score, type Lean } from "@/lib/scoring";
import { FAMILY_STYLE } from "@/lib/types";

/** Remembers which answer set was already written, so a refresh doesn't insert twice. */
const SUBMITTED_KEY = "watermelon-mbti:submitted";
/** The saved row's deletion token, kept only in this tab. */
const TOKEN_KEY = "watermelon-mbti:delete-token";

const noop = () => () => {};

/** One line per trait and lean, in the words of the statements behind it. */
const REASON: Record<Trait, Record<Lean, string>> = {
  messy: { high: "Big, fast, juicy bites, hands first.", mid: "Neither dainty nor messy.", low: "Small, tidy bites, no drips." },
  planner: { high: "You pick, plan and cut with care.", mid: "A little planning, not too much.", low: "No plan. You just grab one." },
  dreamer: { high: "You drift off and lose count.", mid: "Sometimes here, sometimes miles away.", low: "Present for every bite." },
  social: { high: "Watermelon is better shared.", mid: "Happy alone or with friends.", low: "You'd rather eat it alone." },
  calm: { high: "Slow, quiet, one seed at a time.", mid: "Not slow, not rushed.", low: "No time for slow eating." },
  chaos: { high: "Late nights and mystery fridge melon.", mid: "The odd late-night slice.", low: "Fresh melon at sensible hours." },
};

export default function ResultsPage() {
  // Server render has no sessionStorage; the client snapshot takes over on hydration.
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const raw = useSyncExternalStore(noop, () => sessionStorage.getItem(ANSWERS_STORAGE_KEY), () => null);

  const answers = useMemo(() => {
    if (!raw) return null;
    try {
      const parsed: unknown = JSON.parse(raw);
      return isAnswerSet(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }, [raw]);

  const result = useMemo(() => (answers ? score(answers) : null), [answers]);
  const [share, setShare] = useState<number | null>(null);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (!raw || !result) return;
    let cancelled = false;

    const submit =
      sessionStorage.getItem(SUBMITTED_KEY) === raw
        ? Promise.resolve()
        : fetch("/api/quiz/submit", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ answers }),
          })
            .then(async (r) => {
              if (r.status === 503) return; // No database here (local development): nothing to save.
              if (!r.ok) throw new Error(`submit ${r.status}`);
              const { deleteToken } = (await r.json()) as { deleteToken: string };
              sessionStorage.setItem(SUBMITTED_KEY, raw);
              sessionStorage.setItem(TOKEN_KEY, deleteToken);
            })
            .catch((error) => console.error("result not saved", error));

    // Fetch the breakdown after the write so it counts this player too.
    submit
      .then(() => fetch("/api/stats/breakdown"))
      // No stats without a database (503 locally); the tile just keeps its placeholder.
      .then((r) => (r.ok ? (r.json() as Promise<{ shares: Record<string, number> }>) : null))
      .then((data) => {
        if (!cancelled && data) setShare(data.shares[result.type.slug] ?? 0);
      })
      .catch((error) => console.error("breakdown unavailable", error));

    return () => {
      cancelled = true;
    };
  }, [raw, answers, result]);

  const remove = async () => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) return;
    const r = await fetch("/api/quiz/response", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (r.ok || r.status === 404) {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(SUBMITTED_KEY);
      setDeleted(true);
    }
  };

  const type = result?.type;
  const family = type ? FAMILY_STYLE[type.family] : null;

  return (
    <main id="main" className="relative flex min-h-dvh flex-col overflow-hidden text-ink">
      <QuizBackdrop progress={1} />

      <header className="relative border-b border-line bg-paper">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <Wordmark />
          <ThemeToggle />
        </div>
      </header>

      <section className="relative mx-auto flex w-full max-w-3xl flex-1 items-center px-4 py-16 sm:px-8">
        {!hydrated ? null : result && type && family ? (
          <div className="card-enter relative w-full rounded-panel bg-paper shadow-panel ring-1 ring-line">
            <div className="relative overflow-hidden rounded-[inherit] px-6 py-10 text-center sm:px-12 sm:py-14">
              <p className="text-xs font-semibold tracking-[0.16em] text-flesh-deep uppercase">Your result</p>

              <Image
                src={type.image}
                alt=""
                width={301}
                height={250}
                loading="eager"
                className="mx-auto mt-6 h-auto w-full max-w-[240px]"
              />

              <h1 className="mt-4 font-display text-4xl leading-tight font-semibold text-balance text-ink sm:text-5xl">
                {type.name}
              </h1>
              <p className={`mt-2 font-display text-lg font-semibold ${family.ink}`}>{type.family} family</p>

              {type.description && (
                <p className="mx-auto mt-6 max-w-[52ch] text-lg leading-relaxed text-pretty text-ink-2">{type.description}</p>
              )}

              {/* Why this type: the traits in the answers that matched its profile best. */}
              <div className="mx-auto mt-8 max-w-sm text-left">
                <h2 className="text-sm font-semibold text-ink">What gave it away</h2>
                <ul className="mt-3 space-y-2.5">
                  {result.reasons.map(({ trait, lean }) => (
                    <li key={trait} className="flex gap-3 leading-snug text-ink-2">
                      <Check size={18} weight="bold" aria-hidden className={`mt-0.5 shrink-0 ${family.ink}`} />
                      {REASON[trait][lean]}
                    </li>
                  ))}
                </ul>
              </div>

              <dl className="mx-auto mt-9 max-w-xs">
                <div className="rounded-card bg-paper-2 px-4 py-4 ring-1 ring-line">
                  <dd className="font-display text-3xl font-semibold text-ink">
                    {share === null ? <span className="text-ink-3">&hellip;</span> : `${share}%`}
                  </dd>
                  <dt className="mt-1 text-sm text-ink-3">
                    {share === 0 ? "you're the first to get this" : "of players got this too"}
                  </dt>
                </div>
              </dl>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
                <Link
                  href="/quiz"
                  className="inline-flex h-14 items-center gap-4 rounded-control bg-ink py-2 pr-2 pl-6 font-display text-lg font-semibold text-paper shadow-card transition-colors duration-300 hover:bg-ink/85 focus-visible:ring-2 focus-visible:ring-flesh focus-visible:ring-offset-4 focus-visible:outline-none"
                >
                  Take it again
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-flesh text-paper">
                    <ArrowRight size={18} weight="bold" aria-hidden />
                  </span>
                </Link>
                <Link
                  href="/types"
                  className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-ink underline-offset-4 hover:underline"
                >
                  See all 20 types
                  <ArrowRight size={14} weight="bold" aria-hidden />
                </Link>
              </div>

              <p className="mt-8 text-xs leading-relaxed text-ink-3">
                {deleted ? (
                  "Your saved result has been deleted."
                ) : (
                  <>
                    Your answers are stored anonymously to power the stats.{" "}
                    <button type="button" onClick={remove} className="cursor-pointer underline underline-offset-4 hover:text-ink">
                      Delete my response
                    </button>
                    {" "}&middot;{" "}
                    <Link href="/privacy" className="underline underline-offset-4 hover:text-ink">Privacy</Link>
                  </>
                )}
              </p>
            </div>
            <BorderBeam />
          </div>
        ) : (
          <div className="w-full text-center">
            <h1 className="font-display text-4xl font-semibold text-balance text-ink sm:text-5xl">No answers yet.</h1>
            <p className="mx-auto mt-4 max-w-md text-ink-2">
              The test keeps its answers for this browser tab only. Take it to see a result here.
            </p>
            <Link
              href="/quiz"
              className="mt-10 inline-flex h-14 items-center rounded-control bg-ink px-8 font-display text-lg font-semibold text-paper transition-colors duration-300 hover:bg-ink/85"
            >
              Take the test
            </Link>
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
