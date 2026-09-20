// Run: npx tsx --test lib/scoring.test.ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { QUESTIONS, type Answer } from "./questions";
import { score } from "./scoring";

/** Build an answer set by axis-A value and per-group value. */
const build = (a: Answer, groups: Partial<Record<string, Answer>>, rest: Answer = 1): Answer[] =>
  QUESTIONS.map((q) => (q.axis === "A" ? a : (groups[q.group] ?? rest)));

test("all strongly agree: 100% Juicy, ties resolve to Overachiever", () => {
  const s = score(build(7, {}, 7));
  assert.deepEqual([s.axisAPole, s.axisAPercent, s.resultKey], ["Juicy", 100, "JuicyOverachiever"]);
});

test("neutral axis A sits exactly on the midpoint and reads Crisp 50%", () => {
  const s = score(build(4, {}));
  assert.deepEqual([s.axisAPole, s.axisAPercent], ["Crisp", 50]);
});

test("one notch above neutral tips to Juicy", () => {
  const answers = build(4, {});
  answers[0] = 5;
  assert.equal(score(answers).axisAPole, "Juicy");
});

test("group means use each group's own question count", () => {
  // Chaos Snacker (2 questions) at 7 beats Old Soul (3 questions) at 6, even though Old Soul's sum is higher.
  const s = score(build(1, { "Chaos Snacker": 7, "Old Soul": 6 }));
  assert.deepEqual([s.axisBGroup, s.resultKey], ["Chaos Snacker", "CrispChaosSnacker"]);
});

test("multi-word groups produce CamelCase keys", () => {
  assert.equal(score(build(7, { "Life of the Party": 7 })).resultKey, "JuicyLifeOfTheParty");
});
