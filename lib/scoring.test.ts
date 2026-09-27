// Run: npx tsx --test lib/scoring.test.ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { QUESTIONS, TRAITS, type Answer } from "./questions";
import { PROFILES, score } from "./scoring";
import { TYPES } from "./types";

/** Answers that sit on a profile: 2 for low, 4 for mid, 6 for high. */
const answersFor = (slug: string): Answer[] =>
  QUESTIONS.map((q) => ({ 0.15: 2, 0.5: 4, 0.85: 6 })[PROFILES[slug][q.trait]] as Answer);

test("every roster type has exactly one profile", () => {
  assert.deepEqual(Object.keys(PROFILES).sort(), TYPES.map((t) => t.slug).sort());
});

test("answering like a type gives that type, for all 20", () => {
  for (const { slug } of TYPES) assert.equal(score(answersFor(slug)).type.slug, slug);
});

test("all neutral answers give the Ordinary-Eater", () => {
  assert.equal(score(QUESTIONS.map(() => 4 as Answer)).type.slug, "ordinary-eater");
});

test("each trait is the mean of its own statements, 0 to 1", () => {
  // Only the two chaos statements agreed with.
  const s = score(QUESTIONS.map((q) => (q.trait === "chaos" ? 7 : 1)));
  assert.deepEqual(s.traits, { messy: 0, planner: 0, dreamer: 0, social: 0, calm: 0, chaos: 1 });
});

test("reasons are three different traits, led by the type's defining ones", () => {
  const s = score(answersFor("the-saviour-eater"));
  assert.equal(new Set(s.reasons.map((r) => r.trait)).size, 3);
  assert.ok(s.reasons.every((r) => r.lean !== "mid"));
});

test("types are spread evenly across players with evenly spread traits", () => {
  // Seeded, so the check is repeatable: each player has a random true trait level and answers with noise.
  let seed = 20260927;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) % 2 ** 32) / 2 ** 32);
  const noise = () => Math.sqrt(-2 * Math.log(rand() || 1e-9)) * Math.cos(2 * Math.PI * rand()) * 0.9;
  const counts = new Map<string, number>();
  const players = 20000;
  for (let p = 0; p < players; p++) {
    const level = Object.fromEntries(TRAITS.map((t) => [t, rand()]));
    const answers = QUESTIONS.map((q) => Math.min(7, Math.max(1, Math.round(1 + 6 * level[q.trait] + noise()))) as Answer);
    const slug = score(answers).type.slug;
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }
  for (const { slug } of TYPES) {
    const share = (counts.get(slug) ?? 0) / players;
    assert.ok(share > 0.035 && share < 0.07, `${slug} came up ${(share * 100).toFixed(1)}%`);
  }
});
