"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import {
  stagger,
  useAnimate,
  useInView,
  useReducedMotion,
  type AnimationOptions,
  type DOMKeyframesDefinition,
} from "motion/react";
import type { Family } from "@/lib/types";

/**
 * The giant family name on each /types band. Each family pops in its own way
 * every time it scrolls into view. Adapted from Magic UI (MIT,
 * https://github.com/magicuidesign/magicui):
 *
 *   Green   TextAnimate scaleUp  letters pop up from small, with overshoot
 *   Blue    TextAnimate slideUp  letters spring up from below
 *   Yellow  Text3DFlip           letters flip up from the baseline
 *   Purple  HyperText            letters scramble, then decode left to right
 *
 * Only transform and opacity animate, on springs. The server renders the
 * finished word; letters are hidden only while fully off screen, so nothing
 * vanishes in front of the reader. The first band, already on screen at
 * load, gets the same pop from a CSS keyframe that runs before hydration.
 * Nothing moves under prefers-reduced-motion.
 */
export default function FamilyHeading({ family, id, className }: { family: Family; id: string; className: string }) {
  return (
    <h2 id={id} className={className}>
      <span className="sr-only">{family}</span>
      {family === "Purple" ? <Decode word={family} /> : <Letters word={family} {...ENTRANCES[family]} />}
    </h2>
  );
}

type Entrance = {
  hidden: DOMKeyframesDefinition;
  shown: DOMKeyframesDefinition;
  options: AnimationOptions;
  /** Extra style on the word, e.g. perspective for the 3D flip. */
  style?: CSSProperties;
  /** Per-letter class, e.g. the CSS first-paint pop. */
  letterClass?: string;
};

const ENTRANCES: Record<Exclude<Family, "Purple">, Entrance> = {
  Green: {
    hidden: { opacity: 0, scale: 0.45, y: "18%" },
    shown: { opacity: 1, scale: 1, y: "0%" },
    options: { type: "spring", stiffness: 260, damping: 15 },
    letterClass: "letter-pop",
  },
  Blue: {
    hidden: { opacity: 0, y: "45%" },
    shown: { opacity: 1, y: "0%" },
    options: { type: "spring", stiffness: 120, damping: 18 },
  },
  Yellow: {
    hidden: { opacity: 0, rotateX: -95 },
    shown: { opacity: 1, rotateX: 0 },
    options: { type: "spring", stiffness: 110, damping: 14 },
    style: { perspective: "900px" },
  },
};

/**
 * Arms the entrance while the word is completely off screen and plays it once
 * enough of it is back in view. On first mount, a word already on screen is
 * left alone.
 */
function useReplayOnView(scope: RefObject<HTMLElement | null>, onHide: () => void, onShow: () => void) {
  const onScreen = useInView(scope);
  const ready = useInView(scope, { amount: 0.4 });
  const reduced = useReducedMotion();
  const armed = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    const el = scope.current;
    if (reduced || !el) return;
    if (!mounted.current) {
      mounted.current = true;
      if (el.getBoundingClientRect().top < window.innerHeight) return;
    } else if (onScreen) {
      return;
    }
    armed.current = true;
    onHide();
  }, [onScreen, reduced, scope, onHide]);

  useEffect(() => {
    if (!ready || !armed.current) return;
    armed.current = false;
    onShow();
  }, [ready, onShow]);
}

/** Green, Blue, Yellow: a per-letter spring entrance. */
function Letters({ word, hidden, shown, options, style, letterClass = "" }: { word: string } & Entrance) {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const hide = useCallback(() => void animate("[data-letter]", hidden, { duration: 0 }), [animate, hidden]);
  const show = useCallback(() => void animate("[data-letter]", shown, { ...options, delay: stagger(0.07) }), [animate, shown, options]);
  useReplayOnView(scope, hide, show);

  return (
    <span ref={scope} aria-hidden className="inline-block" style={style}>
      {word.split("").map((letter, i) => (
        <span
          key={i}
          data-letter
          className={`inline-block origin-bottom ${letterClass}`}
          style={letterClass ? { animationDelay: `${0.15 + i * 0.07}s` } : undefined}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const FRAME_MS = 55;
const FRAMES_PER_LETTER = 3;

/** Purple: every letter scrambles, then they lock in left to right. Nothing is ever hidden. */
function Decode({ word }: { word: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const letters = word.split("");
  const [shown, setShown] = useState(letters);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  // Off screen: just stop. Letters left mid-scramble are re-scrambled on the next play anyway.
  const stop = useCallback(() => clearInterval(timer.current), []);

  const play = useCallback(() => {
    clearInterval(timer.current);
    const final = word.split("");
    let frame = 0;
    timer.current = setInterval(() => {
      frame += 1;
      const locked = Math.floor(frame / FRAMES_PER_LETTER);
      setShown(
        final.map((letter, i) => {
          if (i < locked) return letter;
          const set = letter === letter.toUpperCase() ? UPPER : LOWER;
          return set[Math.floor(Math.random() * set.length)];
        }),
      );
      if (locked >= final.length) clearInterval(timer.current);
    }, FRAME_MS);
  }, [word]);

  useReplayOnView(ref, stop, play);
  useEffect(() => () => clearInterval(timer.current), []);

  return (
    <span ref={ref} aria-hidden>
      {letters.map((letter, i) => (
        // Each slot keeps the width of its final letter, so scrambling never reflows the word.
        <span key={i} className="relative inline-block">
          <span className="invisible">{letter}</span>
          <span className="absolute inset-0 flex justify-center">{shown[i]}</span>
        </span>
      ))}
    </span>
  );
}
