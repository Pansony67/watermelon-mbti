/**
 * The 20 statements of the test, in the order they are asked.
 *
 * Axis A places you on Juicy <-> Crisp: agreeing with an axis A statement
 * pushes toward Juicy, disagreeing pushes toward Crisp.
 *
 * Axis B picks one of five archetypes: agreeing with a statement pushes
 * toward that statement's group.
 *
 * Nothing is reverse-scored. Scoring itself lives elsewhere; this module is
 * only the data and the answer contract.
 */

export type ArchetypeGroup =
  | "Overachiever"
  | "Daydreamer"
  | "Life of the Party"
  | "Old Soul"
  | "Chaos Snacker";

export type Question =
  | { id: number; text: string; axis: "A"; pole: "Juicy" }
  | { id: number; text: string; axis: "B"; group: ArchetypeGroup };

export const QUESTIONS = [
  { id: 1, text: "You eat watermelon in big pieces.", axis: "A", pole: "Juicy" },
  { id: 2, text: "You eat watermelon fast.", axis: "A", pole: "Juicy" },
  { id: 3, text: "Your hands usually get messy when you eat watermelon.", axis: "A", pole: "Juicy" },
  { id: 4, text: "You eat watermelon with your hands, not a fork.", axis: "A", pole: "Juicy" },
  { id: 5, text: "You can eat several pieces of watermelon in one sitting.", axis: "A", pole: "Juicy" },
  { id: 6, text: "You don't worry much about watermelon juice dripping.", axis: "A", pole: "Juicy" },
  { id: 7, text: "You inspect watermelon carefully before buying it.", axis: "B", group: "Overachiever" },
  { id: 8, text: "You always cut watermelon into neat, even pieces.", axis: "B", group: "Overachiever" },
  { id: 9, text: "You plan ahead before buying watermelon.", axis: "B", group: "Overachiever" },
  { id: 10, text: "You often forget watermelon you've already cut in the fridge.", axis: "B", group: "Daydreamer" },
  { id: 11, text: "You eat watermelon without keeping track of how much you've had.", axis: "B", group: "Daydreamer" },
  { id: 12, text: "You often zone out thinking about other things while eating watermelon.", axis: "B", group: "Daydreamer" },
  { id: 13, text: "You like sharing watermelon with friends.", axis: "B", group: "Life of the Party" },
  { id: 14, text: "You take a photo of watermelon before eating it.", axis: "B", group: "Life of the Party" },
  { id: 15, text: "You'd rather eat watermelon with friends than alone.", axis: "B", group: "Life of the Party" },
  { id: 16, text: "You prefer eating watermelon alone and quietly.", axis: "B", group: "Old Soul" },
  { id: 17, text: "You eat watermelon slowly, without rushing.", axis: "B", group: "Old Soul" },
  { id: 18, text: "You calmly spit out watermelon seeds one at a time.", axis: "B", group: "Old Soul" },
  { id: 19, text: "You eat watermelon late at night.", axis: "B", group: "Chaos Snacker" },
  { id: 20, text: "You eat watermelon that's been in the fridge for days without checking it.", axis: "B", group: "Chaos Snacker" },
] as const satisfies readonly Question[];

export const QUESTION_COUNT = QUESTIONS.length;

/**
 * One answer on the 7-point scale.
 * 7 = strongly agree, 4 = neutral, 1 = strongly disagree.
 * The UI shows Agree on the left, so buttons run 7 -> 1 left to right.
 */
export type Answer = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const SCALE = { strongAgree: 7, neutral: 4, strongDisagree: 1 } as const;

/** Where the finished test parks its answers for the results page. */
export const ANSWERS_STORAGE_KEY = "watermelon-mbti:answers";

export function isAnswer(value: unknown): value is Answer {
  return Number.isInteger(value) && (value as number) >= 1 && (value as number) <= 7;
}

/** True for a complete set: exactly one answer per question, in order. */
export function isAnswerSet(value: unknown): value is Answer[] {
  return Array.isArray(value) && value.length === QUESTION_COUNT && value.every(isAnswer);
}
