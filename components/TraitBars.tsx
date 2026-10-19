import { TRAIT_AXES, TRAIT_LABEL, type TraitAxis } from "@/lib/types";

/**
 * The five trait scores as labelled bars, 0-100. On a family stage (`tone`
 * "stage") the fill is the family glow on a faint cream track; on a page it
 * is ink on the line colour. The strongest trait is marked.
 */
export default function TraitBars({ traits, tone = "stage" }: { traits: Record<TraitAxis, number>; tone?: "stage" | "page" }) {
  const top = TRAIT_AXES.reduce((best, axis) => (traits[axis] > traits[best] ? axis : best));
  const stage = tone === "stage";
  return (
    <ul className="space-y-3">
      {TRAIT_AXES.map((axis) => (
        <li key={axis} className="grid grid-cols-[6.5rem_1fr_2.25rem] items-center gap-3">
          <span className={`text-sm ${axis === top ? "font-semibold" : ""} ${stage ? "text-cine-ink" : "text-ink"}`}>{TRAIT_LABEL[axis]}</span>
          <span aria-hidden className={`h-2 overflow-hidden rounded-full ${stage ? "bg-cine-ink/15" : "bg-line"}`}>
            <span
              className={`block h-full rounded-full ${stage ? "bg-[color:var(--glow)]" : "bg-ink"}`}
              style={{ width: `${traits[axis]}%` }}
            />
          </span>
          <span className={`text-right text-sm tabular-nums ${axis === top ? "font-semibold" : ""} ${stage ? "text-cine-ink" : "text-ink-2"}`}>
            {traits[axis]}
          </span>
        </li>
      ))}
    </ul>
  );
}
