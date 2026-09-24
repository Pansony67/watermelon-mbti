"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import BorderBeam from "@/components/BorderBeam";
import QuizBackdrop from "@/components/QuizBackdrop";
import SiteFooter from "@/components/SiteFooter";
import ThemeToggle from "@/components/ThemeToggle";
import { Wordmark } from "@/components/SiteNav";
import { ANSWERS_STORAGE_KEY, isAnswerSet } from "@/lib/questions";
import Image from "next/image";
import { RESULT_TYPES } from "@/lib/resultTypes";
import { TYPE_ART } from "@/lib/typeArt";
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

  const type = result ? RESULT_TYPES[result.resultKey] : null;
  const art = result ? TYPE_ART[result.resultKey] : undefined;
  const juicy = result?.axisAPole === "Juicy";

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
        {!hydrated ? null : result && type ? (
          <div className="card-enter relative w-full rounded-panel bg-paper shadow-panel ring-1 ring-line">
            <div className="relative overflow-hidden rounded-[inherit] px-6 py-10 text-center sm:px-12 sm:py-14">
              <p className="text-xs font-semibold tracking-[0.16em] text-flesh-deep uppercase">Your result</p>

              {/* Only rendered once this type has art in lib/typeArt.ts. */}
              {art && (
                <div className={`relative mx-auto mt-6 aspect-square w-40 overflow-hidden rounded-card ring-1 ring-line sm:w-48 ${juicy ? "bg-blush" : "bg-mist"}`}>
                  <Image src={art} alt={type.title} fill sizes="192px" className="object-contain p-3" />
                </div>
              )}

              <h1 className="mt-4 font-display text-4xl leading-tight font-semibold text-balance text-ink sm:text-5xl">
                {type.title}
              </h1>
              <p className={`mt-2 font-display text-lg font-semibold ${juicy ? "text-flesh-deep" : "text-ink-2"}`}>
                {result.axisAPole} {result.axisBGroup}
              </p>

              <p className="mx-auto mt-6 max-w-[52ch] text-lg leading-relaxed text-pretty text-ink-2">{type.description}</p>

              <dl className="mx-auto mt-9 grid max-w-md grid-cols-2 gap-3">
                <div className="rounded-card bg-paper-2 px-4 py-4 ring-1 ring-line">
                  <dd className="font-display text-3xl font-semibold text-ink">{result.axisAPercent}%</dd>
                  <dt className="mt-1 text-sm text-ink-3">{result.axisAPole}</dt>
                </div>
                <div className="rounded-card bg-paper-2 px-4 py-4 ring-1 ring-line">
                  <dd className="font-display text-3xl font-semibold text-ink">
                    {share === null ? <span className="text-ink-3">&hellip;</span> : `${share}%`}
                  </dd>
                  <dt className="mt-1 text-sm text-ink-3">
                    {share === 0 ? "you're the first to get this" : "of players got this too"}
                  </dt>
                </div>
              </dl>

              <Link
                href="/quiz"
                className="mt-10 inline-flex h-14 items-center gap-4 rounded-control bg-ink py-2 pr-2 pl-6 font-display text-lg font-semibold text-paper shadow-card transition-colors duration-300 hover:bg-ink/85 focus-visible:ring-2 focus-visible:ring-flesh focus-visible:ring-offset-4 focus-visible:outline-none"
              >
                Take it again
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-flesh text-paper">
                  <ArrowRight size={18} weight="bold" aria-hidden />
                </span>
              </Link>

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
