"use client";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";
import { TRAIT_AXES, TRAIT_LABEL, topTrait, type EaterType, type Family, type TraitAxis } from "@/lib/types";

/** The --cine-*-glow and --cine-ink colours from globals.css, as hex: SVG attributes can't rely on CSS variables in every browser. */
const GLOW: Record<Family, string> = { Green: "#77d9a0", Blue: "#8ab8ff", Yellow: "#f0c250", Purple: "#c0a0ff" };
const CREAM = "#f4efec";

/**
 * A type's five trait scores on a fixed 0-100 radar, plus one line naming the
 * strongest. Given `you`, it draws the player's own scores over the type's
 * typical profile, with a legend, and the line names the player's strongest
 * trait instead. Drawn on the dark stage, so the colours don't follow the theme.
 */
export default function TraitRadar({ type, you }: { type: EaterType; you?: Record<TraitAxis, number> }) {
  const data = TRAIT_AXES.map((axis) => ({ axis: TRAIT_LABEL[axis], typical: type.traits[axis], you: you?.[axis] }));
  const glow = GLOW[type.family];
  const lead = you ?? type.traits;
  const top = topTrait(lead);
  const describe = (scores: Record<TraitAxis, number>) => TRAIT_AXES.map((axis) => `${TRAIT_LABEL[axis]} ${scores[axis]}`).join(", ");

  return (
    <figure>
      {/* Fixed height so the chart can't shift the layout while it measures itself. */}
      <div
        role="img"
        aria-label={
          you
            ? `Your trait scores out of 100: ${describe(you)}. Typical ${type.name}: ${describe(type.traits)}.`
            : `Trait scores out of 100: ${describe(type.traits)}.`
        }
        className="h-72"
      >
        <RadarChart responsive data={data} outerRadius="70%" accessibilityLayer={false} style={{ width: "100%", height: "100%" }}>
          <PolarGrid stroke={CREAM} strokeOpacity={0.14} />
          <PolarAngleAxis dataKey="axis" tick={{ fill: CREAM, fontSize: 13, fontWeight: 600 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          {/* Beside the player's shape, the typical profile steps back to a dashed outline. */}
          <Radar
            dataKey="typical"
            fill={glow}
            fillOpacity={you ? 0.12 : 0.35}
            stroke={glow}
            strokeWidth={2}
            strokeDasharray={you ? "5 4" : undefined}
            isAnimationActive={false}
          />
          {you && <Radar dataKey="you" fill={CREAM} fillOpacity={0.22} stroke={CREAM} strokeWidth={2} isAnimationActive={false} />}
        </RadarChart>
      </div>
      {you && (
        <ul aria-hidden className="mb-2 flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm text-cine-ink-2">
          <li className="flex items-center gap-2">
            <span className="h-0.5 w-5 bg-cine-ink" />
            You
          </li>
          <li className="flex items-center gap-2">
            <span className="w-5 border-t-2 border-dashed border-[color:var(--glow)]" />
            Typical {type.name}
          </li>
        </ul>
      )}
      <figcaption className="text-center text-sm text-cine-ink-2">
        {you ? "Your strongest trait:" : "Mostly driven by"} {TRAIT_LABEL[top]} ({lead[top]})
      </figcaption>
    </figure>
  );
}
