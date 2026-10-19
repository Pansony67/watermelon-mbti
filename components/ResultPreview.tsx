import type { CSSProperties } from "react";
import CharacterStage from "@/components/CharacterStage";
import TraitBars from "@/components/TraitBars";
import { FAMILY_STYLE, TRAIT_LABEL, TYPES, topTrait } from "@/lib/types";

/** A real type, so the preview is honest about what a result looks like. */
const EXAMPLE = TYPES.find((t) => t.slug === "sus-eater")!;

/** An example result card, with the same parts as the real result page. */
export default function ResultPreview() {
  const top = topTrait(EXAMPLE.traits);
  return (
    <figure className="overflow-hidden rounded-panel shadow-panel">
      <CharacterStage type={EXAMPLE} imgClass="h-64 sm:h-72" heights={[256, 288]} className="pt-10">
        <figcaption className="t-label absolute top-4 left-4 rounded-md bg-cine-base/80 px-2.5 py-1.5 text-cine-ink">Example result</figcaption>
      </CharacterStage>
      <div
        className={`px-6 pt-6 pb-7 text-cine-ink ${FAMILY_STYLE[EXAMPLE.family].band}`}
        style={{ "--glow": `var(--cine-${EXAMPLE.family.toLowerCase()}-glow)` } as CSSProperties}
      >
        <p className="t-label text-cine-ink-2">You&rsquo;re the</p>
        <p className="t-h2 mt-1">{EXAMPLE.name}</p>
        <p className="mt-2 leading-snug text-cine-ink-2">{EXAMPLE.tagline}</p>
        <p className="t-label mt-5 text-[color:var(--glow)]">
          {EXAMPLE.family} family &middot; strongest trait: {TRAIT_LABEL[top]}
        </p>
        <div className="mt-4">
          <TraitBars traits={EXAMPLE.traits} />
        </div>
      </div>
    </figure>
  );
}
