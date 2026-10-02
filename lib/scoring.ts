/**
 * Scoring for the branching test. Pure functions, no React and no database:
 * the quiz, the results page and the submit API all run this same code.
 *   scoreFamily  the 8 shared answers pick the family
 *   scoreType    that family's 12 answers pick one of its five types
 *   scoreTraits  every answer feeds one of the five radar axes
 * Answers run 1-7 (7 = strongly agree); every score comes back as 0-100.
 */
import { PHASE_1, PHASE_2, isAnswer, type Answers, type Question } from "./quiz";
import { FAMILIES, TRAIT_AXES, TYPES, type EaterType, type Family, type TraitAxis } from "./types";

const mean = (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length;
const toPercent = (average: number) => Math.round(((average - 1) / 6) * 100);

/** That family's 12 Phase 2 questions, in order. */
export function getPhase2Questions(family: Family): Question[] {
  return PHASE_2.filter((q) => q.family === family);
}

/**
 * The key whose questions have the highest average answer. Each key is
 * divided by its own question count. A tie goes to the key with the highest
 * single answer, then to the earlier key.
 */
function pick<K extends string>(keys: readonly K[], questions: readonly Question[], answers: Answers) {
  const stats = keys.map((key) => {
    const values = questions.filter((q) => q.target === key).map((q) => answers[q.id] as number);
    return { key, mean: mean(values), max: Math.max(...values) };
  });
  const top = stats.reduce((best, s) => (s.mean > best.mean || (s.mean === best.mean && s.max > best.max) ? s : best));
  return { winner: top.key, scores: Object.fromEntries(stats.map((s) => [s.key, toPercent(s.mean)])) as Record<K, number> };
}

export function scoreFamily(answers: Answers): { family: Family; scores: Record<Family, number> } {
  const { winner, scores } = pick(FAMILIES, PHASE_1, answers);
  return { family: winner, scores };
}

export function scoreType(family: Family, answers: Answers): { type: EaterType; scores: Record<string, number> } {
  const roster = TYPES.filter((t) => t.family === family);
  const { winner, scores } = pick(
    roster.map((t) => t.slug),
    getPhase2Questions(family),
    answers,
  );
  return { type: roster.find((t) => t.slug === winner)!, scores };
}

/** Each axis is the mean of every answered question on it, flipped (8 - answer) where agreeing lowers it. */
export function scoreTraits(answers: Answers): Record<TraitAxis, number> {
  const asked = [...PHASE_1, ...PHASE_2].filter((q) => answers[q.id] !== undefined);
  return Object.fromEntries(
    TRAIT_AXES.map((axis) => {
      const values = asked.filter((q) => q.trait === axis).map((q) => (q.sign === 1 ? answers[q.id]! : 8 - answers[q.id]!));
      return [axis, toPercent(mean(values))];
    }),
  ) as Record<TraitAxis, number>;
}

export type Result = {
  family: Family;
  familyScores: Record<Family, number>;
  type: EaterType;
  typeScores: Record<string, number>;
  traits: Record<TraitAxis, number>;
};

/** Everything about a finished run. Pass answers through parseAnswers first. */
export function scoreQuiz(answers: Answers): Result {
  const { family, scores: familyScores } = scoreFamily(answers);
  const { type, scores: typeScores } = scoreType(family, answers);
  return { family, familyScores, type, typeScores, traits: scoreTraits(answers) };
}

/**
 * A finished run, or null. Valid means exactly the 8 shared ids plus the 12
 * ids of the family those 8 pick, each an integer from 1 to 7: missing ids,
 * extra ids and another family's questions are all rejected.
 */
export function parseAnswers(value: unknown): Answers | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  if (!PHASE_1.every((q) => isAnswer(raw[q.id]))) return null;
  const path = [...PHASE_1, ...getPhase2Questions(scoreFamily(raw as Answers).family)];
  if (Object.keys(raw).length !== path.length || !path.every((q) => isAnswer(raw[q.id]))) return null;
  return Object.fromEntries(path.map((q) => [q.id, raw[q.id]])) as Answers;
}

// Every path must reach every axis at least twice, or a radar point would rest on one answer.
if (process.env.NODE_ENV !== "production") {
  for (const family of FAMILIES) {
    const path = [...PHASE_1, ...getPhase2Questions(family)];
    for (const axis of TRAIT_AXES) {
      const count = path.filter((q) => q.trait === axis).length;
      if (count < 2) throw new Error(`The ${family} path asks only ${count} ${axis} question(s); every axis needs at least 2.`);
    }
  }
}
