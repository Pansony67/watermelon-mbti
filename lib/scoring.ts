import { QUESTIONS, SCALE, type Answer, type ArchetypeGroup } from "./questions";

export type Pole = "Juicy" | "Crisp";
export type GroupKey = "Overachiever" | "Daydreamer" | "LifeOfTheParty" | "OldSoul" | "ChaosSnacker";
export type ResultKey = `${Pole}${GroupKey}`;

export type Score = {
  axisAPole: Pole;
  /** 0-100: how far toward `axisAPole` the axis-A answers lean. */
  axisAPercent: number;
  axisBGroup: ArchetypeGroup;
  resultKey: ResultKey;
};

/** Ties on axis B resolve in this order. */
const GROUPS: ArchetypeGroup[] = ["Overachiever", "Daydreamer", "Life of the Party", "Old Soul", "Chaos Snacker"];

const groupKey = (group: ArchetypeGroup) =>
  group.split(" ").map((w) => w[0].toUpperCase() + w.slice(1)).join("") as GroupKey;

export function score(answers: readonly Answer[]): Score {
  const axisA = QUESTIONS.flatMap((q, i) => (q.axis === "A" ? [answers[i]] : []));
  const sum = axisA.reduce((a, b) => a + b, 0);
  const min = axisA.length * SCALE.strongDisagree;
  const max = axisA.length * SCALE.strongAgree;
  const juicy = (sum - min) / (max - min);
  const axisAPole: Pole = sum > (min + max) / 2 ? "Juicy" : "Crisp";
  const axisAPercent = Math.round((axisAPole === "Juicy" ? juicy : 1 - juicy) * 100);

  // Highest mean per group; groups have different question counts.
  const mean = (group: ArchetypeGroup) => {
    const own = QUESTIONS.flatMap((q, i) => (q.axis === "B" && q.group === group ? [answers[i]] : []));
    return own.reduce((a, b) => a + b, 0) / own.length;
  };
  const axisBGroup = GROUPS.reduce((best, g) => (mean(g) > mean(best) ? g : best));

  return { axisAPole, axisAPercent, axisBGroup, resultKey: `${axisAPole}${groupKey(axisBGroup)}` };
}
