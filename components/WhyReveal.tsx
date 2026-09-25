"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Reveal from "@/components/Reveal";
import SeedField from "@/components/SeedField";

const TEXT =
  "No grand thesis. No years of research. I just really wanted to know what kind of watermelon eater you are. Twenty honest questions about how you actually eat watermelon - that’s the whole idea.";

/** Revealed words containing this turn coral instead of ink. */
const HIGHLIGHT = "watermelon";

/** The last word is fully lit here, so the finished statement holds before the section scrolls away. */
const DONE_AT = 0.8;

/**
 * "Why does this exist?", lit word by word as you scroll. Adapted from Magic
 * UI's TextReveal (MIT): https://github.com/magicuidesign/magicui
 *
 * Changes from the original: the dim copy is aria-hidden so screen readers
 * read each word once, words flow as inline text (spaces survive copy and
 * centring), reveal finishes at DONE_AT rather than the very end, colours
 * are theme tokens, and under prefers-reduced-motion the track collapses to
 * a normal section with every word lit, in CSS so nothing waits on hydration.
 */
export default function WhyReveal() {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const words = TEXT.split(" ");

  return (
    <div ref={track} className="relative h-[240vh] border-b border-line bg-paper-2 motion-reduce:h-auto">
      <section className="sticky top-0 flex h-dvh items-center overflow-hidden px-5 sm:px-8 motion-reduce:static motion-reduce:h-auto motion-reduce:py-28">
        <SeedField />
        <div className="relative mx-auto max-w-4xl text-center">
          <Reveal delay={0.05} distance={16}>
            <h1 className="text-sm font-semibold tracking-[0.16em] text-flesh-deep uppercase">Why does this exist?</h1>
          </Reveal>
          <p className="mt-8 font-display text-[1.75rem] leading-[1.2] font-semibold tracking-[-0.01em] text-balance sm:text-5xl lg:text-6xl">
            {words.map((word, i) => (
              <Word
                key={i}
                progress={scrollYProgress}
                range={[(i / words.length) * DONE_AT, ((i + 1) / words.length) * DONE_AT]}
                highlight={word.includes(HIGHLIGHT)}
              >
                {word}
              </Word>
            ))}
          </p>
        </div>
      </section>
    </div>
  );
}

function Word({
  children,
  progress,
  range,
  highlight,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  highlight: boolean;
}) {
  // Pin both ends of the scroll. Motion may run this on a native scroll timeline, where a
  // range that stops short of 1 eases back toward the start value instead of holding.
  const [start, end] = range;
  const opacity = useTransform(progress, start > 0 ? [0, start, end, 1] : [0, end, 1], start > 0 ? [0, 0, 1, 1] : [0, 1, 1]);
  return (
    <>
      <span className="relative inline-block">
        <span aria-hidden className="absolute inset-0 text-ink/15">
          {children}
        </span>
        <motion.span
          style={{ opacity }}
          className={`relative motion-reduce:opacity-100! ${highlight ? "text-flesh-deep" : "text-ink"}`}
        >
          {children}
        </motion.span>
      </span>{" "}
    </>
  );
}
