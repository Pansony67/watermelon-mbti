"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowRight,
  Axe,
  BookOpen,
  Briefcase,
  Coffee,
  Confetti,
  Detective,
  Flask,
  HandFist,
  Headphones,
  Infinity as InfinityIcon,
  Leaf,
  Lightning,
  MagicWand,
  MagnifyingGlass,
  Medal,
  PaintBrush,
  Rocket,
  Shield,
  Sword,
  Trophy,
  type Icon,
} from "@phosphor-icons/react";
import { Dialog } from "radix-ui";
import { PRIMARY_CTA } from "@/components/TypeDetail";
import { FAMILIES, FAMILY_STYLE, TYPES, type EaterType } from "@/lib/types";

// The card and its chart load in their own chunk after the page is up, keeping the landing bundle light.
const TypeDialogPanel = dynamic(() => import("@/components/TypeCharacter").then((m) => m.TypeDialogPanel));

/** One icon per type, after its character art. */
const ICON: Record<string, Icon> = {
  "the-saviour-eater": Sword,
  "shy-eater": BookOpen,
  "quiet-eater": Leaf,
  "watermelon-dictator": Medal,
  "creative-eater": PaintBrush,
  "ordinary-eater": Briefcase,
  "boring-eater": Coffee,
  "introvert-eater": Headphones,
  "extraordinary-eater": MagicWand,
  "defender-eater": Shield,
  "obsessed-eater": Flask,
  "the-master-eater": HandFist,
  "energetic-eater": Lightning,
  "extrovert-eater": Confetti,
  "flexible-eater": InfinityIcon,
  "sus-eater": Detective,
  "logic-eater": MagnifyingGlass,
  "angry-eater": Axe,
  "challenge-eater": Trophy,
  "innovative-eater": Rocket,
};

/**
 * Where each family's chip sits on the 5:4 melon stage, Green, Blue, Yellow,
 * Purple. Phones shrink the chips toward their outer corner, so the bottom two
 * move below the melon there. From sm up they sit beside it, low enough that
 * the longest names still clear the melon's narrowing lower half.
 */
const SLOTS = [
  { side: "left", place: "left-[4%] top-[6%] origin-top-left" },
  { side: "right", place: "right-[2%] top-[5%] origin-top-right" },
  { side: "left", place: "left-[3%] top-[84%] origin-top-left sm:left-[-2%] sm:top-[72%]" },
  { side: "right", place: "right-[3%] top-[84%] origin-top-right sm:right-[-3%] sm:top-[72%]" },
] as const;

/*
  The melon's outline in stage percent, measured from public/melon-poster.png
  (alpha > 200) in 1% steps: the live scene starts on that exact frame, and its
  spin keeps the outline. Re-measure if the poster, camera or melon changes.
*/
/** [left, right] edge x at y = 30, 31, ... 81. */
const SIDES = [[40.5, 46.7], [32.8, 55.2], [29.4, 59.3], [26.8, 62.7], [24.9, 65.3], [23.3, 67.7], [22, 69.8], [21.1, 71.4], [20.3, 73.1], [19.8, 74.3], [19.3, 75.6], [19, 76.8], [18.9, 77.6], [18.9, 78.4], [18.9, 79.1], [19, 79.6], [19.1, 80.1], [19.1, 80.3], [19.3, 80.5], [19.3, 80.6], [19.6, 80.5], [19.7, 80.3], [19.8, 80.1], [20.1, 79.8], [20.3, 79.6], [20.6, 79.3], [20.8, 79.1], [21.2, 78.8], [21.5, 78.4], [21.8, 78.1], [22.3, 77.7], [22.7, 77.3], [23.1, 76.8], [23.6, 76.3], [24.1, 75.8], [24.6, 75.3], [25.3, 74.7], [25.8, 74.1], [26.5, 73.4], [27.2, 72.8], [27.9, 72], [28.8, 71.1], [29.7, 70.3], [30.7, 69.3], [31.6, 68.3], [32.8, 67.1], [34.1, 65.8], [35.4, 64.5], [37.2, 62.7], [38.9, 60.9], [41.4, 58.4], [45.3, 54.8]];
/** [top, bottom] edge y at x = 19, 20, ... 80. */
const SPAN = [[41, 45.8], [38.4, 52.9], [37.1, 56.7], [36, 59.5], [35.3, 61.9], [34.5, 63.9], [34, 65.7], [33.3, 67.3], [32.9, 68.8], [32.5, 70.1], [32.2, 71.3], [31.9, 72.4], [31.5, 73.3], [31.3, 74.3], [31, 75.1], [30.8, 75.9], [30.6, 76.7], [30.5, 77.3], [30.3, 77.9], [30.2, 78.4], [30.1, 79], [30.1, 79.4], [30, 79.8], [30, 80.1], [30, 80.4], [30, 80.7], [30, 80.9], [30, 81.1], [30.1, 81.3], [30.1, 81.4], [30.2, 81.5], [30.3, 81.5], [30.4, 81.4], [30.6, 81.4], [30.7, 81.3], [30.8, 81.1], [31, 80.9], [31.3, 80.7], [31.5, 80.4], [31.8, 80.1], [32, 79.8], [32.2, 79.4], [32.5, 78.9], [32.8, 78.4], [33.1, 77.9], [33.5, 77.2], [33.9, 76.6], [34.3, 75.8], [34.7, 75.1], [35.2, 74.2], [35.6, 73.2], [36.1, 72.3], [36.8, 71.1], [37.4, 70], [38, 68.6], [38.6, 67.2], [39.5, 65.5], [40.3, 63.7], [41.4, 61.7], [42.5, 59.2], [43.9, 56.4], [45.8, 52.4]];

/** A 1%-step outline table read at any point, or null off the melon. */
function read(table: number[][], start: number, at: number, edge: 0 | 1) {
  const k = Math.floor(at - start);
  if (k < 0 || k + 1 >= table.length) return null;
  return table[k][edge] + (table[k + 1][edge] - table[k][edge]) * (at - start - k);
}

type Box = { left: number; top: number; right: number; bottom: number };
/** Melon end first, so the stroke draws out from the melon. */
type Line = [x1: number, y1: number, x2: number, y2: number];

/** Shortest connector worth drawing, in stage percent. */
const MIN_LINE = 1.5;

/**
 * A straight connector from a chip to the melon's outline. Beside the melon it
 * runs level from the chip's inner edge to the melon's side; above or below,
 * it drops straight onto the rim or the underside, near the chip's inner end.
 * Null when the chip already sits on the melon.
 */
function connect(box: Box, side: "left" | "right"): Line | null {
  const y = (box.top + box.bottom) / 2;
  const edge = read(SIDES, 30, y, side === "left" ? 0 : 1);
  const inner = side === "left" ? box.right : box.left;
  if (edge !== null && (side === "left" ? edge - inner : inner - edge) >= MIN_LINE) return [edge, y, inner, y];
  const x = side === "left" ? box.right - 6 : box.left + 6;
  const rim = read(SPAN, 19, x, 0);
  const underside = read(SPAN, 19, x, 1);
  if (rim !== null && rim - box.bottom >= MIN_LINE) return [x, rim, x, box.bottom];
  if (underside !== null && box.top - underside >= MIN_LINE) return [x, underside, x, box.top];
  return null;
}

const noop = () => () => {};
let picks: EaterType[] | undefined;
/** One random type per family, drawn once per page load. */
const pickTypes = () =>
  (picks ??= FAMILIES.map((family) => {
    const pool = TYPES.filter((type) => type.family === family);
    return pool[Math.floor(Math.random() * pool.length)];
  }));

/** Seconds before the first connector draws: lets the melon finish rising into place. */
const START = 0.6;
const STAGGER = 0.14;

/**
 * The four callouts around the hero melon: a random type from each family on
 * every visit. Each connector draws out from the melon's edge, then its chip
 * pops out at the end of it; tapping a chip opens that type's card right here.
 * Client-only (the draw is random), so the server renders nothing for it.
 */
export default function HeroChips() {
  const types = useSyncExternalStore(noop, pickTypes, () => null);
  const root = useRef<HTMLDivElement>(null);
  const chips = useRef<(HTMLDivElement | null)[]>([]);
  const [layout, setLayout] = useState<{ width: number; height: number; lines: (Line | null)[] } | null>(null);

  // Chips are sized by their names, so the connectors are measured, not fixed: again on resize and once fonts load.
  useEffect(() => {
    const stage = root.current;
    if (!types || !stage) return;
    const measure = () => {
      const box = stage.getBoundingClientRect();
      const lines = SLOTS.map((slot, i) => {
        const chip = chips.current[i]?.getBoundingClientRect();
        if (!chip) return null;
        const pct = (x: number, origin: number, size: number) => ((x - origin) / size) * 100;
        return connect(
          {
            left: pct(chip.left, box.left, box.width),
            right: pct(chip.right, box.left, box.width),
            top: pct(chip.top, box.top, box.height),
            bottom: pct(chip.bottom, box.top, box.height),
          },
          slot.side,
        );
      });
      setLayout({ width: box.width, height: box.height, lines });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    for (const chip of chips.current) if (chip) observer.observe(chip);
    return () => observer.disconnect();
  }, [types]);

  if (!types) return null;

  const quiz = (
    <Link href="/quiz" className={PRIMARY_CTA}>
      Take the quiz
      <ArrowRight size={18} weight="bold" aria-hidden />
    </Link>
  );

  return (
    <div ref={root} className="pointer-events-none absolute inset-0">
      {layout && (
        <svg
          width={layout.width}
          height={layout.height}
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          aria-hidden
          className="absolute inset-0 overflow-visible text-ink/20"
        >
          {layout.lines.map(
            (line, i) =>
              line && (
                <line
                  key={types[i].slug}
                  data-slot={i}
                  x1={(line[0] / 100) * layout.width}
                  y1={(line[1] / 100) * layout.height}
                  x2={(line[2] / 100) * layout.width}
                  y2={(line[3] / 100) * layout.height}
                  stroke="currentColor"
                  strokeWidth={1}
                  pathLength={1}
                  className="connector"
                  style={{ animationDelay: `${START + i * STAGGER}s` }}
                />
              ),
          )}
        </svg>
      )}

      {types.map((type, i) => {
        const f = FAMILY_STYLE[type.family];
        const TypeIcon = ICON[type.slug];
        return (
          <div
            key={type.slug}
            ref={(el) => {
              chips.current[i] = el;
            }}
            className={`pointer-events-auto absolute scale-[0.8] sm:scale-100 ${SLOTS[i].place}`}
          >
            <Dialog.Root>
              <Dialog.Trigger asChild>
                {/* Hover (pointer devices only): ring and icon tile take the family colour; the chip lifts and the icon tilts unless
                    motion is reduced. py-2.5 on phones keeps the chip 44px tall after the 0.8 scale. */}
                <button
                  type="button"
                  className={`chip-pop group flex cursor-pointer items-center gap-3 rounded-card bg-paper py-2.5 pr-2 pl-3.5 sm:py-2 text-left shadow-card ring-1 ring-line transition duration-300 ease-settle hover:shadow-panel focus-visible:ring-2 focus-visible:ring-flesh focus-visible:outline-none active:scale-95 motion-safe:hover:-translate-y-1 ${f.hoverRing}`}
                  style={{ animationDelay: `${START + i * STAGGER + 0.3}s` }}
                >
                  <span>
                    <span className="block font-display text-[13px] font-semibold whitespace-nowrap text-ink">{type.name}</span>
                    <span className={`block text-xs font-medium ${f.ink}`}>{type.family}</span>
                  </span>
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-lg transition-colors duration-300 group-hover:text-paper ${f.tint} ${f.ink} ${f.hoverTile}`}
                  >
                    <TypeIcon size={16} aria-hidden className="transition-transform duration-300 ease-settle motion-safe:group-hover:-rotate-12" />
                  </span>
                </button>
              </Dialog.Trigger>
              <TypeDialogPanel type={type} actions={quiz} />
            </Dialog.Root>
          </div>
        );
      })}
    </div>
  );
}
