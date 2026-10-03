// Run: npx tsx --test lib/types.test.ts
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { TRAIT_AXES, TYPES, topTrait } from "./types";

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

test("copy stays inside its word limits, with no em dashes", () => {
  for (const t of TYPES) {
    assert.ok(words(t.tagline) < 12, `${t.slug} tagline`);
    const n = words(t.description);
    assert.ok(n >= 60 && n <= 90, `${t.slug} description is ${n} words`);
    assert.equal(t.habits.length, 3);
    for (const h of t.habits) assert.ok(words(h) < 12, `${t.slug} habit: ${h}`);
    for (const s of [t.tagline, t.description, ...t.habits]) assert.ok(!/[—–]/.test(s), `${t.slug} dash`);
  }
});

test("every type has an image, with its real pixel size stored", () => {
  for (const t of TYPES) {
    assert.ok(existsSync(`public${t.image}`), t.image);
    // A PNG's width and height sit at bytes 16-23, in its IHDR chunk.
    const png = readFileSync(`public${t.image}`);
    assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [t.imageWidth, t.imageHeight], `${t.slug} size`);
  }
});

test("scores are 0-100, profiles are unique, and the top trait leads clearly", () => {
  const seen = new Set<string>();
  for (const t of TYPES) {
    const scores = TRAIT_AXES.map((axis) => t.traits[axis]);
    for (const v of scores) assert.ok(Number.isInteger(v) && v >= 0 && v <= 100, t.slug);
    seen.add(scores.join());
    const [first, second] = [...scores].sort((a, b) => b - a);
    assert.ok(first - second >= 8, `${t.slug}: ${topTrait(t.traits)} leads by only ${first - second}`);
  }
  assert.equal(seen.size, TYPES.length);
});
