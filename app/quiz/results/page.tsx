"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import SiteFooter from "@/components/SiteFooter";
import ThemeToggle from "@/components/ThemeToggle";
import TypeDetail, { PRIMARY_CTA } from "@/components/TypeDetail";
import { Wordmark } from "@/components/SiteNav";
import { ANSWERS_STORAGE_KEY, PROGRESS_STORAGE_KEY } from "@/lib/quiz";
import { parseAnswers, scoreQuiz } from "@/lib/scoring";
import { FAMILIES, FAMILY_STYLE, type Family } from "@/lib/types";

/** Remembers which answer set was already written, so a refresh doesn't insert twice. */
const SUBMITTED_KEY = "watermelon-mbti:submitted";
/** The saved row's deletion token, kept only in this tab. */
const TOKEN_KEY = "watermelon-mbti:delete-token";
/** Below this many saved results the share of players is too noisy to show. */
const MIN_PLAYERS_FOR_SHARE = 30;

const noop = () => () => {};

export default function ResultsPage() {
  // Server render has no sessionStorage; the client snapshot takes over on hydration.
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const raw = useSyncExternalStore(noop, () => sessionStorage.getItem(ANSWERS_STORAGE_KEY), () => null);

  const answers = useMemo(() => {
    if (!raw) return null;
    try {
      return parseAnswers(JSON.parse(raw));
    } catch {
      return null;
    }
  }, [raw]);

  // Scored here too, with the same functions the server uses, so the result shows without a database.
  const result = useMemo(() => (answers ? scoreQuiz(answers) : null), [answers]);
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
      // No stats without a database (503 locally); the line just stays hidden.
      .then((r) => (r.ok ? (r.json() as Promise<{ total: number; shares: Record<string, number> }>) : null))
      .then((data) => {
        if (!cancelled && data && data.total >= MIN_PLAYERS_FOR_SHARE) setShare(data.shares[result.type.slug] ?? 0);
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

  const retake = () => {
    sessionStorage.removeItem(ANSWERS_STORAGE_KEY);
    sessionStorage.removeItem(PROGRESS_STORAGE_KEY);
  };

  return (
    <main id="main" className="flex min-h-dvh flex-col bg-paper text-ink">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <Wordmark />
          <ThemeToggle />
        </div>
      </header>

      {!hydrated ? (
        <div className="flex-1" />
      ) : result ? (
        <div className={`flex-1 ${FAMILY_STYLE[result.family].band}`}>
          <div className="mx-auto w-full max-w-5xl px-5 pt-10 pb-20 sm:px-8 sm:pt-14 sm:pb-28">
            <p className="text-center text-xs font-semibold tracking-[0.16em] text-cine-ink-2 uppercase md:text-left">
              Your result
            </p>
            <div className="mt-6">
              <TypeDetail
                type={result.type}
                you={result.traits}
                actions={
                  <>
                    <Link href="/quiz" onClick={retake} className={PRIMARY_CTA}>
                      Take it again
                      <ArrowRight size={18} weight="bold" aria-hidden />
                    </Link>
                    <Link
                      href={`/types?type=${result.type.slug}`}
                      className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-cine-ink underline-offset-4 hover:underline"
                    >
                      See all 20 types
                      <ArrowRight size={14} weight="bold" aria-hidden />
                    </Link>
                  </>
                }
              >
                <h2 className="mt-8 font-display text-xl font-semibold">Family match</h2>
                <FamilyBars scores={result.familyScores} winner={result.family} />
                {share !== null && (
                  <p className="mt-8 text-cine-ink-2">
                    <span className="font-display text-2xl font-semibold text-cine-ink">{share}%</span> of players got{" "}
                    {result.type.name}
                  </p>
                )}
              </TypeDetail>
            </div>

            <p className="mt-14 text-center text-xs leading-relaxed text-cine-ink-2 md:text-left">
              {deleted ? (
                "Your saved result has been deleted."
              ) : (
                <>
                  Your answers are stored anonymously to power the stats.{" "}
                  <button type="button" onClick={remove} className="cursor-pointer underline underline-offset-4 hover:text-cine-ink">
                    Delete my response
                  </button>
                  {" "}&middot;{" "}
                  <Link href="/privacy" className="underline underline-offset-4 hover:text-cine-ink">
                    Privacy
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      ) : (
        <section className="mx-auto flex w-full max-w-3xl flex-1 items-center px-4 py-16 sm:px-8">
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
        </section>
      )}

      <SiteFooter />
    </main>
  );
}

/** How strongly the shared questions matched each family, 0-100. The winner is lit in its family colour. */
function FamilyBars({ scores, winner }: { scores: Record<Family, number>; winner: Family }) {
  return (
    <ul className="mt-4 space-y-3">
      {FAMILIES.map((family) => {
        const won = family === winner;
        return (
          <li key={family}>
            <div className="flex justify-between text-sm">
              <span className={won ? "font-semibold text-cine-ink" : "text-cine-ink-2"}>{family}</span>
              <span className={`tabular-nums ${won ? "font-semibold text-cine-ink" : "text-cine-ink-2"}`}>{scores[family]}%</span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full bg-cine-ink/10">
              <div
                className={`h-full rounded-full ${won ? "bg-[color:var(--glow)]" : "bg-cine-ink/35"}`}
                style={{ width: `${scores[family]}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
