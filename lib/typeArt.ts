import type { ResultKey } from "./scoring";

/**
 * Illustrations for each result type, shown on the results page. A type
 * without an entry shows no art, so art can be added one type at a time.
 *
 * To add one: put the image in public/types/ (square, 800x800 or larger,
 * transparent PNG or WebP) and map its key here, e.g.
 *   JuicyOverachiever: "/types/juicy-overachiever.png",
 */
export const TYPE_ART: Partial<Record<ResultKey, string>> = {};
