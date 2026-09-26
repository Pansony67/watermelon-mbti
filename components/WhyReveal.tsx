"use client";

import { motion, useReducedMotion, type Transition, type Variants } from "motion/react";
import SeedField from "@/components/SeedField";

const TITLE = "Why does this exist?";

/** [Brackets] mark the phrase that gets the marker highlight. */
const TEXT =
  "No grand thesis. No years of research. I just really wanted to know what kind of [watermelon eater] you are. Twenty honest questions about how you actually eat watermelon - that’s the whole idea.";

const EASE = [0.16, 1, 0.3, 1] as const;
const BODY_START = 0.55;
const BODY_STEP = 0.022;

/** Plain and marked runs, each word numbered in reading order for the stagger. */
let n = 0;
const RUNS = TEXT.split(/\[(.+?)\]/).map((run, i) => ({
  marked: i % 2 === 1,
  words: run
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => ({ word, i: n++ })),
}));
const MARK_END = RUNS.find((run) => run.marked)!.words.at(-1)!.i;

/** Each element's `custom` carries its index and the reduced-motion flag; reduced motion shows everything at once. */
type Custom = { i: number; reduced: boolean | null };
const timing = (reduced: boolean | null, transition: Transition): Transition => (reduced ? { duration: 0 } : transition);

const titleWord: Variants = {
  hidden: { y: "110%" },
  shown: ({ i, reduced }: Custom) => ({ y: "0%", transition: timing(reduced, { duration: 0.9, ease: EASE, delay: 0.1 + i * 0.08 }) }),
};

const bodyWord: Variants = {
  hidden: { opacity: 0, y: 14 },
  shown: ({ i, reduced }: Custom) => ({
    opacity: 1,
    y: 0,
    transition: timing(reduced, { duration: 0.7, ease: EASE, delay: BODY_START + i * BODY_STEP }),
  }),
};

const marker: Variants = {
  hidden: { scaleX: 0 },
  shown: ({ reduced }: Custom) => ({
    scaleX: 1,
    transition: timing(reduced, { duration: 0.6, ease: EASE, delay: BODY_START + MARK_END * BODY_STEP + 0.45 }),
  }),
};

/**
 * The About page's opening statement. Plays once as the page opens: the
 * title slides up out of a mask word by word, the statement follows in a
 * quick stagger, and a coral marker sweeps under "watermelon eater". About
 * two seconds in total, no scroll-jacking. Under prefers-reduced-motion
 * everything appears at once. Screen readers get the plain title once.
 */
export default function WhyReveal() {
  // Only feeds `custom`, which never reaches the DOM, so server and client markup still match.
  const reduced = useReducedMotion();

  return (
    <section className="relative flex min-h-[78dvh] items-center overflow-hidden border-b border-line bg-paper-2 px-5 py-24 sm:px-8">
      <SeedField />
      <motion.div initial="hidden" animate="shown" className="relative mx-auto max-w-4xl text-center">
        <h1 className="font-display text-5xl leading-[1.05] font-semibold tracking-[-0.02em] text-balance text-ink sm:text-7xl">
          <span className="sr-only">{TITLE}</span>
          <span aria-hidden>
            {TITLE.split(" ").map((word, i) => (
              <span key={i}>
                {/* The mask the word rises out of; padded so descenders (y) are not clipped. */}
                <span className="-mb-[0.14em] inline-block overflow-clip pb-[0.14em] align-bottom">
                  <motion.span custom={{ i, reduced }} variants={titleWord} className="inline-block">
                    {word}
                  </motion.span>
                </span>{" "}
              </span>
            ))}
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-[36ch] text-xl leading-[1.55] text-pretty text-ink-2 sm:text-[1.625rem]">
          {RUNS.map((run, r) => {
            // Spaces sit between words and between runs, never at the end of the marked run.
            const words = run.words.map(({ word, i }, w) => (
              <span key={i}>
                <motion.span custom={{ i, reduced }} variants={bodyWord} className="inline-block">
                  {word}
                </motion.span>
                {w < run.words.length - 1 && " "}
              </span>
            ));
            return (
              <span key={r}>
                {r > 0 && " "}
                {run.marked ? (
                  <span className="relative isolate inline-block font-medium whitespace-nowrap text-ink">
                    <motion.span
                      aria-hidden
                      custom={{ i: MARK_END, reduced }}
                      variants={marker}
                      className="absolute inset-x-[-0.12em] bottom-[0.38em] -z-10 h-[0.44em] origin-left rounded-xs bg-flesh/30"
                    />
                    {words}
                  </span>
                ) : (
                  words
                )}
              </span>
            );
          })}
        </p>
      </motion.div>
    </section>
  );
}
