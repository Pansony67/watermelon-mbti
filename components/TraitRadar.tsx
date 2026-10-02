"use client";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";
import { TRAIT_AXES, TRAIT_LABEL, topTrait, type EaterType, type Family } from "@/lib/types";

/** The --cine-*-glow and --cine-ink colours from globals.css, as hex: SVG attributes can't rely on CSS variables in every browser. */
const GLOW: Record<Family, string> = { Green: "#77d9a0", Blue: "#8ab8ff", Yellow: "#f0c250", Purple: "#c0a0ff" };
const CREAM = "#f4efec";

/**
 * A type's five trait scores on a fixed 0-100 radar, plus one line naming the
 * strongest. Drawn on the dark stage, so the colours don't follow the theme.
 */
export default function TraitRadar({ type }: { type: EaterType }) {
  const data = TRAIT_AXES.map((axis) => ({ axis: TRAIT_LABEL[axis], score: type.traits[axis] }));
  const top = topTrait(type);
  const glow = GLOW[type.family];

  return (
    <figure>
      {/* Fixed height so the chart can't shift the layout while it measures itself. */}
      <div
        role="img"
        aria-label={`Trait scores out of 100: ${data.map((d) => `${d.axis} ${d.score}`).join(", ")}.`}
        className="h-72"
      >
        <RadarChart responsive data={data} outerRadius="70%" accessibilityLayer={false} style={{ width: "100%", height: "100%" }}>
          <PolarGrid stroke={CREAM} strokeOpacity={0.14} />
          <PolarAngleAxis dataKey="axis" tick={{ fill: CREAM, fontSize: 13, fontWeight: 600 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar dataKey="score" fill={glow} fillOpacity={0.35} stroke={glow} strokeWidth={2} isAnimationActive={false} />
        </RadarChart>
      </div>
      <figcaption className="text-center text-sm text-cine-ink-2">
        Mostly driven by {TRAIT_LABEL[top]} ({type.traits[top]})
      </figcaption>
    </figure>
  );
}
