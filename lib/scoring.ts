import { QUESTIONS, SCALE, TRAITS, type Answer, type Trait } from "./questions";
import { TYPES, type EaterType } from "./types";

/** Where a type sits on a trait. */
const L = 0.15;
const M = 0.5;
const H = 0.85;
type Level = typeof L | typeof M | typeof H;

/**
 * Each type's profile on the six traits, read from its name:
 *   messy    Q1-6    big, fast, sticky-handed bites
 *   planner  Q7-9    inspects, plans, cuts neat pieces
 *   dreamer  Q10-12  forgets, loses count, zones out
 *   social   Q13-15  shares, photographs, eats with friends
 *   calm     Q16-18  alone, slow, seed by seed
 *   chaos    Q19-20  late nights, unchecked fridge melon
 *
 * `offset` is a calibration knob, in squared-distance units: types with
 * roomy profiles near the middle would otherwise win far more often than
 * types at the edges. The offsets were fitted by simulating 30,000 players
 * with evenly spread traits until each type came up about 1 in 20 times
 * (4.5-5.7% on a fresh sample). Re-fit them if profiles or questions change;
 * scoring.test.ts checks the spread still holds.
 */
export const PROFILES: Record<string, Record<Trait, Level> & { offset: number }> = {
  "the-saviour-eater": { messy: H, planner: L, dreamer: L, social: H, calm: M, chaos: L, offset: -0.117 },
  "shy-eater": { messy: L, planner: M, dreamer: M, social: L, calm: H, chaos: L, offset: 0.018 },
  "quiet-eater": { messy: L, planner: L, dreamer: H, social: L, calm: H, chaos: L, offset: 0.002 },
  "watermelon-dictator": { messy: L, planner: H, dreamer: L, social: H, calm: L, chaos: L, offset: -0.103 },
  "creative-eater": { messy: M, planner: L, dreamer: H, social: H, calm: M, chaos: M, offset: 0.186 },
  "ordinary-eater": { messy: M, planner: M, dreamer: L, social: M, calm: M, chaos: L, offset: -0.017 },
  "boring-eater": { messy: L, planner: M, dreamer: L, social: L, calm: M, chaos: L, offset: -0.064 },
  "introvert-eater": { messy: H, planner: L, dreamer: M, social: L, calm: H, chaos: M, offset: 0.111 },
  "extraordinary-eater": { messy: H, planner: H, dreamer: M, social: H, calm: L, chaos: L, offset: -0.022 },
  "defender-eater": { messy: M, planner: H, dreamer: L, social: L, calm: L, chaos: L, offset: -0.1 },
  "obsessed-eater": { messy: H, planner: L, dreamer: H, social: M, calm: L, chaos: H, offset: 0.056 },
  "the-master-eater": { messy: H, planner: H, dreamer: L, social: M, calm: M, chaos: L, offset: -0.015 },
  "energetic-eater": { messy: H, planner: L, dreamer: L, social: M, calm: L, chaos: L, offset: -0.139 },
  "extrovert-eater": { messy: M, planner: M, dreamer: L, social: H, calm: L, chaos: M, offset: 0.012 },
  "flexible-eater": { messy: M, planner: L, dreamer: M, social: H, calm: M, chaos: H, offset: 0.166 },
  "sus-eater": { messy: M, planner: L, dreamer: L, social: L, calm: M, chaos: H, offset: 0.067 },
  "logic-eater": { messy: L, planner: H, dreamer: L, social: L, calm: H, chaos: L, offset: -0.105 },
  "angry-eater": { messy: H, planner: M, dreamer: L, social: L, calm: L, chaos: H, offset: -0.021 },
  "challenge-eater": { messy: H, planner: L, dreamer: L, social: H, calm: L, chaos: M, offset: -0.155 },
  "innovative-eater": { messy: M, planner: H, dreamer: H, social: M, calm: L, chaos: H, offset: 0.239 },
};

/** Which way a type leans on a trait: the key for the "what gave it away" lines. */
export type Lean = "high" | "mid" | "low";

export type Score = {
  type: EaterType;
  /** Each trait from 0 (disagreed with all its statements) to 1 (agreed with all). */
  traits: Record<Trait, number>;
  /** The three traits where the answers matched the type best, strongest first. */
  reasons: { trait: Trait; lean: Lean }[];
};

const lean = (level: Level): Lean => (level === H ? "high" : level === L ? "low" : "mid");

/** The type whose profile is closest to the answers. Ties go to the earlier type in the roster. */
export function score(answers: readonly Answer[]): Score {
  const span = SCALE.strongAgree - SCALE.strongDisagree;
  const traits = Object.fromEntries(
    TRAITS.map((trait) => {
      const own = QUESTIONS.flatMap((q, i) => (q.trait === trait ? [answers[i]] : []));
      return [trait, (own.reduce((a, b) => a + b, 0) / own.length - SCALE.strongDisagree) / span];
    }),
  ) as Record<Trait, number>;

  const distance = (slug: string) => {
    const profile = PROFILES[slug];
    return TRAITS.reduce((sum, trait) => sum + (traits[trait] - profile[trait]) ** 2, 0) + profile.offset;
  };
  const type = TYPES.reduce((best, t) => (distance(t.slug) < distance(best.slug) ? t : best));

  // How well each trait matches: toward the pole for a high or low trait, toward the middle for a mid one.
  // A trait that defines the type (high or low) and that the answers lean toward ranks above any mid trait.
  const profile = PROFILES[type.slug];
  const reasons = TRAITS.map((trait) => {
    const value = traits[trait];
    const match = profile[trait] === H ? value : profile[trait] === L ? 1 - value : 1 - 2 * Math.abs(value - 0.5);
    const rank = match + (profile[trait] !== M && match >= 0.5 ? 1 : 0);
    return { trait, lean: lean(profile[trait]), rank };
  })
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 3)
    .map(({ trait, lean }) => ({ trait, lean }));

  return { type, traits, reasons };
}

