import type { ResultKey } from "./scoring";

/**
 * Illustrations for each result type, shown in the type containers on the
 * landing page and on the results page. A type without an entry renders an
 * empty container, so art can be added one type at a time.
 *
 * To add one: put the image in public/types/ (square, 800x800 or larger,
 * transparent PNG or WebP) and map its key here, e.g.
 *   JuicyOverachiever: "/types/juicy-overachiever.png",
 */
export const TYPE_ART: Partial<Record<ResultKey, string>> = {};

/**
 * Text under each container in the "Meet the 10 types" grid: `title` is the
 * bold line, `subtitle` the smaller one below. Placeholders until the final
 * names are written.
 */
const PLACEHOLDER = { title: "Subject", subtitle: "Subject" };

export const TYPE_CARD_TEXT: Record<ResultKey, { title: string; subtitle: string }> = {
  JuicyOverachiever: PLACEHOLDER,
  JuicyDaydreamer: PLACEHOLDER,
  JuicyLifeOfTheParty: PLACEHOLDER,
  JuicyOldSoul: PLACEHOLDER,
  JuicyChaosSnacker: PLACEHOLDER,
  CrispOverachiever: PLACEHOLDER,
  CrispDaydreamer: PLACEHOLDER,
  CrispLifeOfTheParty: PLACEHOLDER,
  CrispOldSoul: PLACEHOLDER,
  CrispChaosSnacker: PLACEHOLDER,
};
