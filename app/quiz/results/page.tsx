"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import BorderBeam from "@/components/BorderBeam";
import QuizBackdrop from "@/components/QuizBackdrop";
import SiteFooter from "@/components/SiteFooter";
import { Wordmark } from "@/components/SiteNav";
import { ANSWERS_STORAGE_KEY, isAnswerSet } from "@/lib/questions";
import { RESULT_TYPES } from "@/lib/resultTypes";
import { score } from "@/lib/scoring";

/** Remembers which answer set was already written, so a refresh doesn't insert twice. */
const SUBMITTED_KEY = "watermelon-mbti:submitted";
/** The saved row's deletion token, kept only in this tab. */
const TOKEN_KEY = "watermelon-mbti:delete-token";

const noop = () => () => {};

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
              if (!r.ok) throw new Error(`submit ${r.status}`);
              const { deleteToken } = (await r.json()) as { deleteToken: string };
              sessionStorage.setItem(SUBMITTED_KEY, raw);
              sessionStorage.setItem(TOKEN_KEY, deleteToken);
            })
            .catch((error) => console.error("result not saved", error));

    // Fetch the breakdown after the write so it counts this player too.
    submit
      .then(() => fetch("/api/stats/breakdown"))
      .then((r) => r.json())
      .then((data: { shares: Record<string, number> }) => {
        if (!cancelled) setShare(data.shares[result.resultKey] ?? 0);
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

  return (
    <main id="main" className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-rind text-cream">
      <div className="grain" aria-hidden />
      <QuizBackdrop progress={1} />

      <header className="relative mx-auto flex h-[72px] w-full max-w-7xl items-center px-5 sm:px-8">
        <Wordmark />
      </header>

      <section className="relative mx-auto flex w-full max-w-3xl flex-1 items-center px-4 pb-16 sm:px-8">
        {!hydrated ? null : result ? (
          <div className="card-enter relative w-full rounded-[2rem] bg-[linear-gradient(135deg,rgba(255,77,109,0.55),rgba(251,243,228,0.12)_45%,rgba(234,247,217,0.5))] p-px shadow-rind-lg">
            <div className="rounded-[calc(2rem-1px)] bg-rind-deep/72 px-6 py-10 text-center shadow-[inset_0_1px_0_rgba(251,243,228,0.12)] backdrop-blur-2xl sm:px-12 sm:py-14">
              <p className="text-[11px] font-medium tracking-[0.16em] text-pith/80 uppercase">Your result</p>

              <h1 className="mt-4 font-display text-4xl leading-tight font-semibold text-balance sm:text-5xl">
                {RESULT_TYPES[result.resultKey].title}
              </h1>
              <p className="mt-2 font-display text-lg font-semibold text-flesh">
                {result.axisAPole} {result.axisBGroup}
              </p>

              <p className="mx-auto mt-6 max-w-[52ch] text-lg leading-relaxed text-pretty text-cream/70">
                {RESULT_TYPES[result.resultKey].description}
              </p>

              <dl className="mx-auto mt-9 grid max-w-md grid-cols-2 gap-3">
                <div className="rounded-2xl bg-cream/[0.045] px-4 py-4 ring-1 ring-cream/[0.07]">
                  <dd className="font-display text-3xl font-semibold text-flesh">{result.axisAPercent}%</dd>
                  <dt className="mt-1 text-sm text-cream/60">{result.axisAPole}</dt>
                </div>
                <div className="rounded-2xl bg-cream/[0.045] px-4 py-4 ring-1 ring-cream/[0.07]">
                  <dd className="font-display text-3xl font-semibold text-flesh">
                    {share === null ? <span className="text-cream/40">&hellip;</span> : `${share}%`}
                  </dd>
                  <dt className="mt-1 text-sm text-cream/60">
                    {share === 0 ? "you're the first to get this" : "of players got this too"}
                  </dt>
                </div>
              </dl>

              <Link
                href="/quiz"
                className="group mt-10 inline-flex h-14 items-center gap-4 rounded-full bg-flesh py-2 pr-2 pl-7 font-display text-lg font-semibold text-rind-deep shadow-rind transition-transform duration-500 ease-settle hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-4 focus-visible:ring-offset-rind focus-visible:outline-none active:translate-y-0 active:scale-[0.98]"
              >
                Take it again
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rind-deep/15 transition-transform duration-500 ease-settle group-hover:translate-x-0.5 group-hover:scale-105">
                  <ArrowRight size={18} weight="bold" aria-hidden />
                </span>
              </Link>

              <p className="mt-8 text-xs leading-relaxed text-cream/60">
                {deleted ? (
                  "Your saved result has been deleted."
                ) : (
                  <>
                    Your answers are stored anonymously to power the stats.{" "}
                    <button type="button" onClick={remove} className="cursor-pointer underline underline-offset-4 hover:text-cream">
                      Delete my response
                    </button>
                    {" "}&middot;{" "}
                    <Link href="/privacy" className="underline underline-offset-4 hover:text-cream">Privacy</Link>
                  </>
                )}
              </p>
            </div>
            <BorderBeam />
          </div>
        ) : (
          <div className="w-full text-center">
            <h1 className="font-display text-4xl font-semibold text-balance sm:text-5xl">No answers yet.</h1>
            <p className="mx-auto mt-4 max-w-md text-cream/60">
              The test keeps its answers for this browser tab only. Take it to see a result here.
            </p>
            <Link
              href="/quiz"
              className="mt-10 inline-flex h-14 items-center rounded-full bg-flesh px-8 font-display text-lg font-semibold text-rind-deep transition-transform duration-500 ease-settle hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
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
