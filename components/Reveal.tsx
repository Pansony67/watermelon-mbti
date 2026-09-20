"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

/** Heavy, settled ease: fast out, long soft landing. */
const EASE = [0.16, 1, 0.3, 1] as const;

type RevealProps = {
  children: ReactNode;
  /** Seconds. Stagger siblings by passing increasing values. */
  delay?: number;
  /** Pixels the element travels up while fading in. */
  distance?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Fade-and-rise entrance for hero content. Only `opacity` and `transform`
 * are animated. Under prefers-reduced-motion the transition is instant, so
 * server and client render identical markup and nothing moves.
 */
export default function Reveal({
  children,
  delay = 0,
  distance = 28,
  className,
  style,
}: RevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
