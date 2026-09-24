"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

type Square = { id: number; pos: [number, number]; n: number };

/**
 * A fine grid where a few cells softly light up and fade, like a page of
 * graph paper with the answers being filled in. Adapted from Magic UI's
 * AnimatedGridPattern (MIT, listed on 21st.dev):
 * https://magicui.design/docs/components/animated-grid-pattern
 *
 * Changes from the original: colour comes from `currentColor` so callers set
 * it with a text class, no class-merge helper, squares are (re)generated in
 * the resize callback rather than an effect, and under prefers-reduced-motion
 * only the static grid renders.
 */
export default function GridBackground({
  cell = 44,
  squares: count = 24,
  maxOpacity = 0.5,
  duration = 4,
  className = "",
}: {
  cell?: number;
  squares?: number;
  maxOpacity?: number;
  duration?: number;
  className?: string;
}) {
  const id = useId();
  const reduced = useReducedMotion();
  const svg = useRef<SVGSVGElement>(null);
  const size = useRef({ width: 0, height: 0 });
  const [squares, setSquares] = useState<Square[]>([]);

  const randomCell = (): [number, number] => [
    Math.floor((Math.random() * size.current.width) / cell),
    Math.floor((Math.random() * size.current.height) / cell),
  ];

  // The server renders the bare grid; squares appear once the element is measured.
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      size.current = { width: entry.contentRect.width, height: entry.contentRect.height };
      if (reduced || !size.current.width || !size.current.height) return setSquares([]);
      setSquares(
        Array.from({ length: count }, (_, i) => ({
          id: i,
          pos: [
            Math.floor((Math.random() * size.current.width) / cell),
            Math.floor((Math.random() * size.current.height) / cell),
          ],
          n: 0,
        })),
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced, count, cell]);

  const move = (squareId: number) =>
    setSquares((current) => {
      const next = current.slice();
      const square = next[squareId];
      if (square) next[squareId] = { ...square, pos: randomCell(), n: square.n + 1 };
      return next;
    });

  return (
    <svg ref={svg} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      <defs>
        <pattern id={id} width={cell} height={cell} patternUnits="userSpaceOnUse" x={-1} y={-1}>
          <path d={`M.5 ${cell}V.5H${cell}`} fill="none" stroke="currentColor" strokeOpacity={0.5} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={-1} y={-1} className="overflow-visible">
        {squares.map(({ id: squareId, pos: [x, y], n }, i) => (
          <motion.rect
            key={`${squareId}-${n}`}
            initial={{ opacity: 0 }} // unslop-ignore: the requested ambient grid; static under reduced motion
            animate={{ opacity: maxOpacity }}
            transition={{ duration, repeat: 1, repeatType: "reverse", delay: i * 0.15, repeatDelay: 0.5 }}
            onAnimationComplete={() => move(squareId)}
            width={cell - 1}
            height={cell - 1}
            x={x * cell + 1}
            y={y * cell + 1}
            fill="currentColor"
            fillOpacity={0.35}
          />
        ))}
      </svg>
    </svg>
  );
}
