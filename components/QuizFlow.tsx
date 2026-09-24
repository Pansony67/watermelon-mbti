"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import BorderBeam from "@/components/BorderBeam";
import QuizBackdrop from "@/components/QuizBackdrop";
import ThemeToggle from "@/components/ThemeToggle";
import { Wordmark } from "@/components/SiteNav";
import { ANSWERS_STORAGE_KEY, QUESTIONS, type Answer } from "@/lib/questions";

/** Long enough to see the selection land, short enough to feel instant. */
const ADVANCE_DELAY_MS = 300;
const EASE = [0.16, 1, 0.3, 1] as const;

type Side = "agree" | "neutral" | "disagree";

/**
 * Display order runs Agree -> Disagree, so values run 7 -> 1. Every button is
 * the same hit size; only the visible disc inside tapers toward neutral.
 */
const OPTIONS: { value: Answer; label: string; side: Side; disc: string }[] = [
  { value: 7, label: "Strongly agree", side: "agree", disc: "h-9 w-9 sm:h-14 sm:w-14" },
  { value: 6, label: "Agree", side: "agree", disc: "h-[31px] w-[31px] sm:h-12 sm:w-12" },
  { value: 5, label: "Slightly agree", side: "agree", disc: "h-[26px] w-[26px] sm:h-10 sm:w-10" },
  { value: 4, label: "Neutral", side: "neutral", disc: "h-[22px] w-[22px] sm:h-8 sm:w-8" },
  { value: 3, label: "Slightly disagree", side: "disagree", disc: "h-[26px] w-[26px] sm:h-10 sm:w-10" },
  { value: 2, label: "Disagree", side: "disagree", disc: "h-[31px] w-[31px] sm:h-12 sm:w-12" },
  { value: 1, label: "Strongly disagree", side: "disagree", disc: "h-9 w-9 sm:h-14 sm:w-14" },
];

/*
  Agree is coral (Juicy), disagree is seed ink (Crisp), neutral sits between.
  Idle rings use full-strength colours so every control boundary clears 3:1
  against the white card.
*/
const SIDE_STYLES: Record<Side, { idle: string; selected: string }> = {
  agree: {
    idle: "border-flesh group-hover:bg-blush",
    selected: "border-flesh bg-flesh text-paper",
  },
  neutral: {
    idle: "border-ink-3 group-hover:bg-paper-2",
    selected: "border-ink-3 bg-ink-3 text-paper",
  },
  disagree: {
    idle: "border-ink group-hover:bg-mist",
    selected: "border-ink bg-ink text-paper",
  },
};

/* The answer scale is circles by definition, so these stay round on purpose. */
const DISC = "grid place-items-center rounded-full border-2 transition-[background-color,border-color] duration-300 ease-settle"; // unslop-ignore

const NAV_BUTTON =
  "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-control px-3 text-sm font-medium text-ink-2 transition-colors duration-300 hover:text-ink focus-visible:ring-2 focus-visible:ring-flesh focus-visible:outline-none";

/** Forward slides in from the right and out to the left; back is the mirror. */
const cardVariants = {
  enter: ({ dir }: { dir: number }) => ({ opacity: 0, x: 40 * dir }),
  center: { opacity: 1, x: 0 },
  exit: ({ dir, reduced }: { dir: number; reduced: boolean }) => ({
    opacity: 0,
    x: -40 * dir,
    transition: { duration: reduced ? 0 : 0.2, ease: EASE },
  }),
};

export default function QuizFlow() {
  const router = useRouter();
  const reduced = useReducedMotion() ?? false;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(Answer | null)[]>(() =>
    Array.from(QUESTIONS, () => null),
  );
  /** Which way the next card travels: 1 = forward, -1 = back. */
  const [direction, setDirection] = useState<1 | -1>(1);

  const pendingAdvance = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const total = QUESTIONS.length;
  const question = QUESTIONS[index];
  const current = answers[index];
  const isLast = index === total - 1;
  const answered = answers.filter((answer) => answer !== null).length;

  useEffect(() => {
    router.prefetch("/quiz/results");
    return () => {
      if (pendingAdvance.current) clearTimeout(pendingAdvance.current);
    };
  }, [router]);

  // Put focus on each new statement so screen readers announce it.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [index]);

  const goTo = (next: number, dir: 1 | -1) => {
    setDirection(dir);
    setIndex(next);
  };

  const finish = (final: (Answer | null)[]) => {
    // Only reachable by answering every question, but never trust that.
    const missing = final.findIndex((answer) => answer === null);
    if (missing !== -1) {
      goTo(missing, 1);
      return;
    }
    sessionStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(final));
    router.push("/quiz/results");
  };

  const select = (value: Answer) => {
    const next = answers.slice();
    next[index] = value;
    setAnswers(next);

    // A second click inside the delay replaces the first; the last choice wins.
    if (pendingAdvance.current) clearTimeout(pendingAdvance.current);
    pendingAdvance.current = setTimeout(() => {
      pendingAdvance.current = null;
      if (isLast) finish(next);
      else goTo(index + 1, 1);
    }, ADVANCE_DELAY_MS);
  };

  // Arrow keys walk the scale without selecting; Enter or Space selects.
  const onScaleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step =
      event.key === "ArrowRight" || event.key === "ArrowDown" ? 1
      : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1
      : 0;
    if (!step) return;
    event.preventDefault();
    const radios = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]')];
    const at = radios.indexOf(document.activeElement as HTMLButtonElement);
    const to = at === -1 ? (step > 0 ? 0 : radios.length - 1) : (at + step + radios.length) % radios.length;
    radios[to]?.focus();
  };

  return (
    <>
      <main id="main" className="relative flex min-h-dvh flex-col overflow-hidden text-ink">
        <QuizBackdrop progress={answered / total} />

        <header className="relative border-b border-line bg-paper">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
            <Wordmark />
            <div className="flex items-center gap-4">
              <p className="text-sm text-ink-3">
                <span className="font-display font-semibold text-ink">{answered}</span> of {total} answered
              </p>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <section className="relative mx-auto flex w-full max-w-3xl flex-1 items-center px-4 pb-16 sm:px-8">
          <div className="card-enter relative w-full rounded-panel bg-paper shadow-panel ring-1 ring-line">
            <div className="relative overflow-hidden rounded-[inherit] px-3 pt-5 pb-9 sm:px-12 sm:pt-6 sm:pb-14">
              {/* Row 1: back, position, forward. Fixed height so Q1 (no Back yet) matches the rest. */}
              <div className="grid h-9 grid-cols-[1fr_auto_1fr] items-center">
                <div>
                  {index > 0 && (
                    <button type="button" onClick={() => goTo(index - 1, -1)} className={`${NAV_BUTTON} -ml-3`}>
                      <ArrowLeft size={15} weight="bold" aria-hidden />
                      Back
                    </button>
                  )}
                </div>
                <p className="font-display text-sm font-semibold text-ink tabular-nums" aria-live="polite">
                  <span className="sr-only">Question {index + 1} of {total}</span>
                  <span aria-hidden>
                    {String(index + 1).padStart(2, "0")}
                    <span className="mx-1 text-ink-3">/</span>
                    {total}
                  </span>
                </p>
                <div className="text-right">
                  {/* Only after going back: a way forward that doesn't require re-answering. */}
                  {current !== null && !isLast && (
                    <button type="button" onClick={() => goTo(index + 1, 1)} className={`${NAV_BUTTON} -mr-3`}>
                      Next
                      <ArrowRight size={15} weight="bold" aria-hidden />
                    </button>
                  )}
                </div>
              </div>

              {/* Row 2: one segment per question. Answered fills coral, current is ink. */}
              <div
                role="progressbar"
                aria-label="Questions answered"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={answered}
                className="mt-4 grid grid-cols-20 gap-1"
              >
                {QUESTIONS.map((q, i) => (
                  <span
                    key={q.id}
                    className={`h-1.5 rounded-xs transition-colors duration-300 ${
                      answers[i] !== null ? "bg-flesh" : i === index ? "bg-ink-3" : "bg-line"
                    }`}
                  />
                ))}
              </div>

              <AnimatePresence mode="popLayout" initial={false} custom={{ dir: direction, reduced }}>
                <motion.div
                  key={index}
                  custom={{ dir: direction, reduced }}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
                  className="w-full"
                >
                  {/* Reserved for the longest statement (4 lines on phones, 3 on desktop) so the scale never moves. */}
                  <div className="mt-7 grid min-h-[8rem] place-items-center sm:mt-9 sm:min-h-[10rem]">
                    <h1
                      ref={headingRef}
                      tabIndex={-1}
                      className="text-center font-display text-2xl leading-tight font-semibold text-balance text-ink outline-none sm:text-4xl lg:text-[2.6rem]"
                    >
                      {question.text}
                    </h1>
                  </div>

                  <div
                    role="radiogroup"
                    aria-label="Your answer"
                    onKeyDown={onScaleKeyDown}
                    className="mt-8 sm:mt-12"
                  >
                    <div className="mb-3 flex justify-between font-display text-sm font-semibold sm:hidden">
                      <span className="text-flesh-deep">Agree</span>
                      <span className="text-ink">Disagree</span>
                    </div>

                    <div className="flex items-center justify-between gap-1 sm:gap-3">
                      <span className="hidden font-display text-lg font-semibold text-flesh-deep sm:block">
                        Agree
                      </span>

                      {OPTIONS.map((option) => {
                        const selected = current === option.value;
                        const styles = SIDE_STYLES[option.side];
                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            aria-label={option.label}
                            onClick={() => select(option.value)}
                            className="group grid h-10 w-10 shrink-0 cursor-pointer touch-manipulation place-items-center rounded-control transition-transform duration-200 focus-visible:ring-2 focus-visible:ring-flesh focus-visible:outline-none active:scale-95 sm:h-14 sm:w-14"
                          >
                            <span
                              aria-hidden
                              className={`${DISC} ${option.disc} ${
                                selected ? `${styles.selected} pop` : styles.idle
                              }`}
                            >
                              {selected && <Check size={16} weight="bold" />}
                            </span>
                          </button>
                        );
                      })}

                      <span className="hidden font-display text-lg font-semibold text-ink sm:block">
                        Disagree
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <BorderBeam />
          </div>
        </section>

        <footer className="relative mx-auto flex w-full max-w-7xl flex-col gap-3 pr-20 pb-6 pl-5 text-xs text-ink-3 sm:pr-24 sm:pl-8 md:flex-row md:items-end md:justify-between">
          <p>
            WatermelonMBTI
            <span className="mx-2" aria-hidden>&middot;</span>
            <Link href="/privacy" className="hover:text-ink">Privacy</Link>
            <span className="mx-2" aria-hidden>&middot;</span>
            <Link href="/terms" className="hover:text-ink">Terms</Link>
          </p>
          <p className="italic md:text-right">Same people, different flavors.</p>
        </footer>
      </main>
    </>
  );
}
