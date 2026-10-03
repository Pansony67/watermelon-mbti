"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { stagger, useAnimate, useInView, useReducedMotion, type DOMKeyframesDefinition } from "motion/react";
import TypeCharacter from "@/components/TypeCharacter";
import type { EaterType, Family } from "@/lib/types";

/** The word's clip once revealed: negative insets so the tall glyphs are never cut. */
const OPEN = "inset(-30% -10% -40% -10%)";

/** Each family's word is wiped in from its own side, with a small drift the same way. */
const WIPE: Record<Family, DOMKeyframesDefinition> = {
  Green: { clipPath: "inset(-30% 110% -40% -10%)", x: "-4%" },
  Blue: { clipPath: "inset(130% -10% -40% -10%)", y: "10%" },
  Yellow: { clipPath: "inset(-30% 50% -40% 50%)", scale: 0.92 },
  Purple: { clipPath: "inset(-30% -10% -40% 110%)", x: "4%" },
};

/**
 * One band of the /types character select: the family name, the stage
 * spotlight, and its five characters. When the band scrolls into view the
 * light powers on, the name wipes in from its family's side, and the
 * characters rise in one after another. The entrance re-arms while the band
 * is fully off screen, so it plays again on every visit.
 *
 * The server renders the finished band; nothing is hidden unless it is off
 * screen. `intro` marks the band already on screen at load, which plays the
 * same entrance from CSS keyframes (globals.css) before hydration. Only
 * transform, opacity and a clip animate. Still under prefers-reduced-motion.
 */
export default function CineBand({ family, types, intro }: { family: Family; types: EaterType[]; intro: boolean }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();

  const hide = useCallback(() => {
    animate("[data-glow]", { opacity: 0, scale: 0.8 }, { duration: 0 });
    animate("[data-word]", WIPE[family], { duration: 0 });
    animate("[data-char]", { opacity: 0, y: 48 }, { duration: 0 });
  }, [animate, family]);

  const show = useCallback(() => {
    animate("[data-glow]", { opacity: 1, scale: 1 }, { duration: 1.2, ease: [0.16, 1, 0.3, 1] });
    animate("[data-word]", { clipPath: OPEN, x: "0%", y: "0%", scale: 1 }, { duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] });
    animate("[data-char]", { opacity: 1, y: 0 }, { type: "spring", stiffness: 120, damping: 18, delay: stagger(0.09, { startDelay: 0.3 }) });
  }, [animate]);

  useReplayOnView(scope, hide, show);

  return (
    <div ref={scope} className="relative">
      {/* Stage spotlight behind the row: the characters are dark photographs and need light behind them. */}
      <div
        data-glow
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-[38%] bottom-[-10%] bg-[radial-gradient(50%_55%_at_50%_55%,color-mix(in_srgb,var(--glow)_24%,transparent),transparent_75%)] ${intro ? "cine-intro-glow" : ""}`}
      />

      <h2
        id={`family-${family}`}
        className="pointer-events-none text-center text-[19vw] leading-[0.85] font-black tracking-[-0.04em] [font-stretch:118%] text-[color:color-mix(in_srgb,var(--glow)_22%,transparent)] select-none lg:text-[15rem]"
      >
        <span data-word className={`inline-block ${intro ? "cine-intro-word" : ""}`}>
          {family}
        </span>
      </h2>

      {/* Wrapping row of figures at one height, each as wide as itself; a short last row centres. */}
      <ul className="relative mx-auto mt-6 flex max-w-7xl flex-wrap items-start justify-center gap-x-6 gap-y-10 sm:mt-10 sm:gap-x-10">
        {types.map((type, i) => (
          <li
            key={type.slug}
            data-char
            className={intro ? "cine-intro-char" : undefined}
            style={intro ? ({ "--i": i } as React.CSSProperties) : undefined}
          >
            <TypeCharacter type={type} eager={intro} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Hides the band only while it is completely off screen and plays the
 * entrance once enough of it is back in view. On first mount, a band already
 * on screen is left alone (its CSS intro, if any, covers it).
 */
function useReplayOnView(scope: RefObject<HTMLElement | null>, onHide: () => void, onShow: () => void) {
  const onScreen = useInView(scope);
  // Low threshold: the name sits at the top of the band, so the wipe should start as it appears.
  const ready = useInView(scope, { amount: 0.12 });
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
