// Run: npx tsx --test lib/scoring.test.ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { PHASE_1, PHASE_2, type Answer, type Answers } from "./quiz";
import { getPhase2Questions, parseAnswers, scoreFamily, scoreQuiz, scoreTraits, scoreType } from "./scoring";
import { FAMILIES, TRAIT_AXES, TYPES, type Family } from "./types";

/** A full run on one family's path, every answer `fill` unless overridden. */
const run = (family: Family, fill: Answer, overrides: Answers = {}): Answers => ({
  ...Object.fromEntries([...PHASE_1, ...getPhase2Questions(family)].map((q) => [q.id, fill])),
  ...overrides,
});

test("question data: 8 shared, 12 per family, each type asked 2 or 3 times, unique ids", () => {
  assert.equal(PHASE_1.length, 8);
  const ids = [...PHASE_1, ...PHASE_2].map((q) => q.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const family of FAMILIES) {
    assert.equal(PHASE_1.filter((q) => q.target === family).length, 2);
    assert.equal(getPhase2Questions(family).length, 12);
    for (const type of TYPES.filter((t) => t.family === family)) {
      const n = PHASE_2.filter((q) => q.target === type.slug && q.family === family).length;
      assert.ok(n === 2 || n === 3, `${type.slug} has ${n} questions`);
    }
  }
});

test("every family path covers each trait at least twice", () => {
  for (const family of FAMILIES) {
    const path = [...PHASE_1, ...getPhase2Questions(family)];
    for (const axis of TRAIT_AXES) assert.ok(path.filter((q) => q.trait === axis).length >= 2, `${family} ${axis}`);
  }
});

test("the family with the highest Phase 1 average wins, with 0-100 scores", () => {
  const { family, scores } = scoreFamily({ "p1-g1": 1, "p1-g2": 1, "p1-b1": 4, "p1-b2": 4, "p1-y1": 7, "p1-y2": 6, "p1-p1": 2, "p1-p2": 3 });
  assert.equal(family, "Yellow");
  assert.deepEqual(scores, { Green: 0, Blue: 50, Yellow: 92, Purple: 25 });
});

test("family ties go to the highest single answer, then to Green, Blue, Yellow, Purple order", () => {
  // Blue and Purple both average 5; Purple has the 7.
  const answers: Answers = { "p1-g1": 1, "p1-g2": 1, "p1-b1": 5, "p1-b2": 5, "p1-y1": 1, "p1-y2": 1, "p1-p1": 3, "p1-p2": 7 };
  assert.equal(scoreFamily(answers).family, "Purple");
  assert.equal(scoreFamily(run("Green", 4)).family, "Green");
});

test("type scores divide by each type's own question count; ties fall back to max, then roster order", () => {
  // Saviour (3 questions) averages 6; Shy (2 questions) averages 6.5.
  const answers = run("Green", 1, { "g-1": 6, "g-2": 6, "g-3": 6, "g-4": 7, "g-5": 6 });
  assert.equal(scoreType("Green", answers).type.slug, "shy-eater");
  // Saviour 6,6,6 vs Quiet 5,7: same mean, Quiet has the 7.
  assert.equal(scoreType("Green", run("Green", 1, { "g-1": 6, "g-2": 6, "g-3": 6, "g-6": 5, "g-7": 7 })).type.slug, "quiet-eater");
  // All equal: the first type in the roster.
  for (const family of FAMILIES) assert.equal(scoreType(family, run(family, 4)).type, TYPES.find((t) => t.family === family));
});

test("traits flip answers where agreeing lowers the trait", () => {
  // Agreeing with everything: social on the Blue path has +1 and -1 questions, mess only -1 ones.
  const traits = scoreTraits(run("Blue", 7));
  assert.equal(traits.mess, 0);
  assert.equal(traits.speed, 50); // p1-y1 (+1) and b-7 (-1)
  assert.equal(scoreTraits(run("Blue", 4)).chaos, 50);
});

test("parseAnswers accepts exactly one path and rejects anything else", () => {
  const blue = run("Blue", 4, { "p1-b1": 7 });
  assert.equal(scoreQuiz(parseAnswers(blue)!).family, "Blue");
  assert.equal(parseAnswers(run("Green", 4, { "p1-b1": 7 })), null); // Phase 2 from the wrong family
  assert.equal(parseAnswers({ ...blue, extra: 4 }), null);
  const missing = { ...blue };
  delete missing["b-12"];
  assert.equal(parseAnswers(missing), null);
  assert.equal(parseAnswers({ ...blue, "b-1": 8 }), null);
  assert.equal(parseAnswers({ ...blue, "b-1": 2.5 }), null);
  assert.equal(parseAnswers(Object.values(blue)), null);
});
