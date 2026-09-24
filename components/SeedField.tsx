"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

/**
 * Deterministic scatter so server and client render the same seeds. Values are
 * rounded: the server serialises style numbers at lower precision than the
 * client computes them, and full floats would trip a hydration mismatch.
 */
const SEEDS = Array.from({ length: 22 }, (_, i) => {
  const n = (k: number) => {
    const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
    return Math.round((x - Math.floor(x)) * 1000) / 1000;
  };
  return {
    left: n(1) * 100,
    top: n(2) * 100,
    size: 7 + n(3) * 8,
    rotate: n(4) * 360,
    opacity: 0.08 + n(5) * 0.1,
    soft: n(6) > 0.6,
  };
});

/**
 * Watermelon seeds drifting slowly behind a section, driven by anime.js.
 * Decorative only: masked away from the centre so copy stays clean, paused
 * while off screen, and static under prefers-reduced-motion.
 */
export default function SeedField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Per-seed values: anime passes (target, index, ...), all optional in its types.
    const per = (f: (i: number) => number | number[]) => (_?: unknown, i = 0) => f(i);
    const drift = animate(el.querySelectorAll<HTMLElement>("[data-seed]"), {
      translateY: per((i) => [0, -(18 + (i % 5) * 7)]),
      translateX: per((i) => [0, (i % 2 ? 1 : -1) * (5 + (i % 4) * 4)]),
      rotate: per((i) => [0, (i % 2 ? 1 : -1) * 22]),
      duration: per((i) => 6000 + (i % 6) * 900),
      delay: stagger(140),
      loop: true,
      alternate: true,
      ease: "inOutSine",
      autoplay: false,
    });

    // Only spend frames while a meaningful slice of the section is on screen.
    const io = new IntersectionObserver(
      ([entry]) => (entry.intersectionRatio >= 0.1 ? drift.play() : drift.pause()),
      { threshold: [0, 0.1] },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      drift.revert();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:radial-gradient(ellipse_50%_55%_at_50%_50%,transparent_32%,#000_78%)]"
    >
      {SEEDS.map((seed, i) => (
        <span
          key={i}
          className="absolute block"
          style={{ left: `${seed.left}%`, top: `${seed.top}%`, transform: `rotate(${seed.rotate}deg)` }}
        >
          <span
            data-seed
            className="block rounded-full bg-ink" // unslop-ignore: seeds are ellipses
            style={{
              width: seed.size,
              height: seed.size * 0.6,
              opacity: seed.opacity,
              filter: seed.soft ? "blur(1.5px)" : undefined,
            }}
          />
        </span>
      ))}
    </div>
  );
}
