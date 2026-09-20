"use client";

import { motion, useReducedMotion, type MotionStyle } from "motion/react";

/**
 * A soft light that travels the edge of its parent. Adapted from Magic UI's
 * BorderBeam (MIT, https://magicui.design/docs/components/border-beam):
 * brand colours, no class-merge helper, and nothing rendered under
 * prefers-reduced-motion so the static hairline stands alone.
 *
 * The parent needs `position: relative` and a border radius; the beam picks
 * the radius up with `rounded-[inherit]`.
 */
export default function BorderBeam({
  size = 180,
  duration = 9,
  borderWidth = 1.5,
  colorFrom = "#FF4D6D",
  colorTo = "#EAF7D9",
}: {
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
}) {
  if (useReducedMotion()) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)] mask-intersect [mask-clip:padding-box,border-box]"
      style={{ "--border-beam-width": `${borderWidth}px` } as React.CSSProperties}
    >
      <motion.div
        className="absolute aspect-square bg-linear-to-l from-(--color-from) via-(--color-to) to-transparent"
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            "--color-from": colorFrom,
            "--color-to": colorTo,
          } as MotionStyle
        }
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: ["0%", "100%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration }}
      />
    </div>
  );
}
