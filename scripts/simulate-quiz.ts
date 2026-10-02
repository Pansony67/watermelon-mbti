// Balance check: runs simulated players through the real scoring and prints how often each family
// and type comes up. Run: npx tsx scripts/simulate-quiz.ts
import { PHASE_1, type Answer, type Answers } from "../lib/quiz";
import { getPhase2Questions, scoreFamily, scoreQuiz } from "../lib/scoring";
import { FAMILIES, TYPES } from "../lib/types";

const PLAYERS = 10_000;

// Seeded (mulberry32) so runs are repeatable.
let seed = 20261002;
const random = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const uniform = () => (1 + Math.floor(random() * 7)) as Answer;
/** Normal around 4 (sd 1.5, Box-Muller), rounded and clamped to the scale. */
const middling = () => {
  const n = Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());
  return Math.min(7, Math.max(1, Math.round(4 + 1.5 * n))) as Answer;
};

function simulate(label: string, answer: () => Answer) {
  const families = new Map<string, number>();
  const types = new Map<string, number>();
  for (let i = 0; i < PLAYERS; i++) {
    const answers: Answers = Object.fromEntries(PHASE_1.map((q) => [q.id, answer()]));
    // Phase 2 follows whichever family Phase 1 picked, exactly as the quiz does.
    const { family } = scoreFamily(answers);
    for (const q of getPhase2Questions(family)) answers[q.id] = answer();
    const result = scoreQuiz(answers);
    families.set(result.family, (families.get(result.family) ?? 0) + 1);
    types.set(result.type.slug, (types.get(result.type.slug) ?? 0) + 1);
  }

  const pct = (n = 0) => (n / PLAYERS) * 100;
  const flags: string[] = [];
  console.log(`\n${label} (${PLAYERS.toLocaleString()} players)`);
  for (const family of FAMILIES) {
    const share = pct(families.get(family));
    if (share < 15 || share > 35) flags.push(`family ${family} ${share.toFixed(1)}%`);
    console.log(`  ${family.padEnd(7)} ${share.toFixed(1).padStart(5)}%`);
    for (const type of TYPES.filter((t) => t.family === family)) {
      const typeShare = pct(types.get(type.slug));
      if (typeShare < 2 || typeShare > 10) flags.push(`${type.slug} ${typeShare.toFixed(1)}%`);
      console.log(`      ${type.name.padEnd(22)} ${typeShare.toFixed(1).padStart(5)}%`);
    }
  }
  console.log(flags.length ? `  FLAGGED: ${flags.join(", ")}` : "  No flags.");
}

simulate("Uniform random answers", uniform);
simulate("Answers bunched around 4 (normal, sd 1.5)", middling);
