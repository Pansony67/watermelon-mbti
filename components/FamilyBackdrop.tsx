"use client";

import { useId, useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { FAMILY_STYLE, type Family } from "@/lib/types";

/**
 * The ambient background behind each /types band. One shared system: a soft
 * spotlight lifts the character row off the band (the characters are dark
 * cutouts), and each family adds one slow motif in its own ink. Motifs
 * adapted from Magic UI (MIT, https://github.com/magicuidesign/magicui):
 *
 *   Green   LightRays   a few wide beams sway down from the top
 *   Blue    Ripple      still rings, with one sonar pulse sent out at a time
 *   Yellow  DotPattern  a still dot grid with a soft light drifting beneath it
 *   Purple  Meteors     a still night sky, crossed by the odd shooting star
 *
 * Kept deliberately quiet: only transform and opacity animate, cycles are
 * long, everything stops while the band is off screen, and positions come
 * from a fixed seed so the server renders the same frame the client does.
 * Under prefers-reduced-motion each band shows a still frame.
 */
export default function FamilyBackdrop({ family }: { family: Family }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "120px" });
  const reduced = useReducedMotion();
  const Scene = SCENES[family];

  return (
    <div ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${FAMILY_STYLE[family].ink}`}>
      <Scene live={inView && !reduced} />
      {/* Spotlight behind the characters: white on the pale bands, a breath of the ink on the dark ones. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_46%_34%_at_50%_72%,rgb(255_255_255/0.7),transparent_72%)] dark:bg-[radial-gradient(ellipse_46%_34%_at_50%_72%,color-mix(in_srgb,currentColor_9%,transparent),transparent_72%)]" />
    </div>
  );
}

type SceneProps = { live: boolean };

const SCENES: Record<Family, (props: SceneProps) => React.ReactNode> = {
  Green: LightRays,
  Blue: Sonar,
  Yellow: DriftingLight,
  Purple: NightSky,
};

/** Deterministic 0-1 noise, rounded so server and client serialise identical styles. */
const noise = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return Math.round((x - Math.floor(x)) * 1000) / 1000;
};
const round = (n: number) => Math.round(n * 100) / 100;

const RAYS = Array.from({ length: 5 }, (_, i) => ({
  left: round(12 + i * 19 + noise(i, 1) * 8),
  rotate: round(-18 + noise(i, 2) * 36),
  width: Math.round(220 + noise(i, 3) * 160),
  swing: round(1 + noise(i, 4) * 1.5),
  delay: round(noise(i, 5) * 8),
  duration: round(16 + noise(i, 6) * 8),
  peak: round(0.5 + noise(i, 7) * 0.35),
}));

/** Green: wide, heavily blurred beams from above. Only their opacity and angle move. */
function LightRays({ live }: SceneProps) {
  return (
    <>
      {RAYS.map((ray, i) => (
        <motion.div
          key={i}
          className="absolute top-[-15%] h-[110%] origin-top -translate-x-1/2 bg-linear-to-b from-white/80 to-transparent blur-[48px] dark:from-current/10"
          style={{ left: `${ray.left}%`, width: ray.width }}
          initial={{ opacity: round(ray.peak * 0.6), rotate: ray.rotate }}
          animate={
            live
              ? { opacity: [round(ray.peak * 0.3), ray.peak, round(ray.peak * 0.3)], rotate: [ray.rotate - ray.swing, ray.rotate + ray.swing, ray.rotate - ray.swing] }
              : { opacity: round(ray.peak * 0.6), rotate: ray.rotate }
          }
          transition={live ? { duration: ray.duration, delay: ray.delay, repeat: Infinity, ease: "easeInOut" } : { duration: 0.8 }}
        />
      ))}
    </>
  );
}

const RINGS = [260, 420, 580, 740, 900];
const RING = "absolute top-[62%] left-1/2 -translate-1/2 rounded-full border border-current"; // unslop-ignore: a ripple is circles by definition

/** Blue: hairline rings sit still; a single ring leaves the centre and fades, every few seconds. */
function Sonar({ live }: SceneProps) {
  return (
    <div className="absolute inset-0 mask-[radial-gradient(ellipse_62%_75%_at_50%_62%,#000_35%,transparent_100%)]">
      {RINGS.map((size, i) => (
        <div
          key={size}
          className={RING}
          style={{ width: size, height: size, opacity: round(0.3 - i * 0.05) }}
        />
      ))}
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className={`${RING} h-225 w-225`}
          initial={{ scale: 0.25, opacity: 0 }}
          animate={live ? { scale: [0.25, 1], opacity: [0.45, 0] } : { scale: 0.25, opacity: 0 }}
          transition={live ? { duration: 6, delay: i * 3, repeat: Infinity, ease: [0.22, 1, 0.36, 1] } : { duration: 0.4 }}
        />
      ))}
    </div>
  );
}

const LIGHT = "absolute top-[10%] left-[20%] h-[70%] w-[45%] rounded-full bg-white/70 blur-[90px] dark:bg-current/12"; // unslop-ignore: a soft light source, blurred to nothing at the edge

/** Yellow: a soft light wanders slowly under a fixed dot grid, so the grid seems to catch it. */
function DriftingLight({ live }: SceneProps) {
  const id = useId();
  return (
    <>
      <motion.div
        className={LIGHT}
        initial={{ x: "0%", y: "0%" }}
        animate={live ? { x: ["0%", "70%", "25%", "0%"], y: ["0%", "15%", "-10%", "0%"] } : { x: "0%", y: "0%" }}
        transition={live ? { duration: 26, repeat: Infinity, ease: "easeInOut" } : { duration: 0.8 }}
      />
      <svg className="absolute inset-0 h-full w-full mask-[radial-gradient(ellipse_80%_75%_at_50%_50%,#000_35%,transparent_100%)]">
        <defs>
          <pattern id={`${id}-dots`} width={20} height={20} patternUnits="userSpaceOnUse">
            <circle cx={1.5} cy={1.5} r={1.1} fill="currentColor" fillOpacity={0.3} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id}-dots)`} />
      </svg>
    </>
  );
}

const STARS = Array.from({ length: 46 }, (_, i) => ({
  left: round(noise(i, 31) * 100),
  top: round(noise(i, 32) * 100),
  size: noise(i, 33) > 0.8 ? 2 : 1,
  opacity: round(0.25 + noise(i, 34) * 0.45),
}));

const STAR = "absolute rounded-full bg-current"; // unslop-ignore: stars are points

/** Travel direction: down and to the left. The tail trails back up-right, the way it came. */
const TRAVEL = 520;
const DIR = { x: -0.8, y: 0.6 };
/** Shared keyframe times; the path is a straight line, so position keyframes use the same fractions. */
const PATH = [0, 0.15, 0.75, 1];
const SHOOTING = Array.from({ length: 4 }, (_, i) => ({
  left: round(35 + noise(i, 21) * 60),
  top: round(-5 + noise(i, 22) * 35),
  delay: round(1 + i * 2.6 + noise(i, 23) * 2),
  duration: round(1.3 + noise(i, 24) * 0.8),
  rest: round(7 + noise(i, 25) * 6),
}));

/** Purple: fixed stars (dark theme only, where they read as sky, not specks), and a rare shooting star. */
function NightSky({ live }: SceneProps) {
  return (
    <>
      <div className="absolute inset-0 hidden dark:block">
        {STARS.map((star, i) => (
          <span
            key={i}
            className={STAR}
            style={{ left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size, opacity: star.opacity }}
          />
        ))}
      </div>
      {SHOOTING.map((meteor, i) => (
        <motion.span
          key={i}
          className="absolute block h-px w-28 bg-linear-to-r from-current to-transparent"
          style={{ left: `${meteor.left}%`, top: `${meteor.top}%`, rotate: -37, originX: 0 }}
          initial={{ opacity: 0 }} // unslop-ignore: a shooting star is invisible between passes
          animate={
            live
              ? { x: PATH.map((t) => DIR.x * TRAVEL * t), y: PATH.map((t) => DIR.y * TRAVEL * t), opacity: [0, 0.8, 0.6, 0] }
              : { opacity: 0 }
          }
          transition={
            live
              ? { duration: meteor.duration, delay: meteor.delay, repeat: Infinity, repeatDelay: meteor.rest, ease: "easeIn", times: PATH }
              : { duration: 0.3 }
          }
        />
      ))}
    </>
  );
}
