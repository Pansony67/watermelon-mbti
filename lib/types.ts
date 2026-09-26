/**
 * The 20 watermelon-eater types, in display order. Single source of truth for
 * every page that shows them. The quiz still scores the old 10 types
 * (lib/scoring.ts, lib/resultTypes.ts) until the scoring rewrite.
 */

export type Family = "Green" | "Blue" | "Yellow" | "Purple";

export type EaterType = {
  slug: string;
  name: string;
  family: Family;
  /** Transparent PNG cutout, about 300x250, under public/images/types/. */
  image: string;
  /** Written later. Empty until then; do not fill with placeholder copy. */
  description: string;
};

export const FAMILIES: Family[] = ["Green", "Blue", "Yellow", "Purple"];

const ROSTER: Record<Family, [slug: string, name: string][]> = {
  Green: [
    ["the-saviour-eater", "The Saviour-Eater"],
    ["shy-eater", "Shy-Eater"],
    ["quiet-eater", "Quiet-Eater"],
    ["watermelon-dictator", "Watermelon Dictator"],
    ["creative-eater", "Creative-Eater"],
  ],
  Blue: [
    ["ordinary-eater", "Ordinary-Eater"],
    ["boring-eater", "Boring-Eater"],
    ["introvert-eater", "Introvert-Eater"],
    ["extraordinary-eater", "Extraordinary-Eater"],
    ["defender-eater", "Defender-Eater"],
  ],
  Yellow: [
    ["obsessed-eater", "Obsessed-Eater"],
    ["the-master-eater", "The Master Eater"],
    ["energetic-eater", "Energetic-Eater"],
    ["extrovert-eater", "Extrovert-Eater"],
    ["flexible-eater", "Flexible-Eater"],
  ],
  Purple: [
    ["sus-eater", "Sus-Eater"],
    ["logic-eater", "Logic-Eater"],
    ["angry-eater", "Angry-Eater"],
    ["challenge-eater", "Challenge-Eater"],
    ["innovative-eater", "Innovative-Eater"],
  ],
};

export const TYPES: EaterType[] = FAMILIES.flatMap((family) =>
  ROSTER[family].map(([slug, name]) => ({
    slug,
    name,
    family,
    image: `/images/types/${slug}.png`,
    description: "",
  })),
);

/**
 * Family colours: a soft `tint` for bands and tiles, and an `ink` that passes
 * AA on the tint and on paper in both themes. `hoverRing` and `hoverTile`
 * are the landing-page chip's hover state: ring and icon tile take the ink. Written
 * out in full so Tailwind can find the class names.
 */
export const FAMILY_STYLE: Record<Family, { tint: string; ink: string; mark: string; hoverRing: string; hoverTile: string }> = {
  Green: {
    tint: "bg-cat-green",
    ink: "text-cat-green-ink",
    mark: "text-cat-green-ink/15",
    hoverRing: "hover:ring-cat-green-ink/40",
    hoverTile: "group-hover:bg-cat-green-ink",
  },
  Blue: {
    tint: "bg-cat-blue",
    ink: "text-cat-blue-ink",
    mark: "text-cat-blue-ink/15",
    hoverRing: "hover:ring-cat-blue-ink/40",
    hoverTile: "group-hover:bg-cat-blue-ink",
  },
  Yellow: {
    tint: "bg-cat-yellow",
    ink: "text-cat-yellow-ink",
    mark: "text-cat-yellow-ink/15",
    hoverRing: "hover:ring-cat-yellow-ink/40",
    hoverTile: "group-hover:bg-cat-yellow-ink",
  },
  Purple: {
    tint: "bg-cat-purple",
    ink: "text-cat-purple-ink",
    mark: "text-cat-purple-ink/15",
    hoverRing: "hover:ring-cat-purple-ink/40",
    hoverTile: "group-hover:bg-cat-purple-ink",
  },
};
