/**
 * The 20 statements of the test, in the order they are asked. Each one
 * measures one of six traits; agreeing pushes that trait up, disagreeing
 * pushes it down. Nothing is reverse-scored. Scoring lives in scoring.ts;
 * this module is only the data and the answer contract.
 */

/** The six traits, in the order they are asked. */
export const TRAITS = ["messy", "planner", "dreamer", "social", "calm", "chaos"] as const;
export type Trait = (typeof TRAITS)[number];

export type Question = { id: number; text: string; trait: Trait };

export const QUESTIONS = [
  { id: 1, text: "You eat watermelon in big pieces.", trait: "messy" },
  { id: 2, text: "You eat watermelon fast.", trait: "messy" },
  { id: 3, text: "Your hands usually get messy when you eat watermelon.", trait: "messy" },
  { id: 4, text: "You eat watermelon with your hands, not a fork.", trait: "messy" },
  { id: 5, text: "You can eat several pieces of watermelon in one sitting.", trait: "messy" },
  { id: 6, text: "You don't worry much about watermelon juice dripping.", trait: "messy" },
  { id: 7, text: "You inspect watermelon carefully before buying it.", trait: "planner" },
  { id: 8, text: "You always cut watermelon into neat, even pieces.", trait: "planner" },
  { id: 9, text: "You plan ahead before buying watermelon.", trait: "planner" },
  { id: 10, text: "You often forget watermelon you've already cut in the fridge.", trait: "dreamer" },
  { id: 11, text: "You eat watermelon without keeping track of how much you've had.", trait: "dreamer" },
  { id: 12, text: "You often zone out thinking about other things while eating watermelon.", trait: "dreamer" },
  { id: 13, text: "You like sharing watermelon with friends.", trait: "social" },
  { id: 14, text: "You take a photo of watermelon before eating it.", trait: "social" },
  { id: 15, text: "You'd rather eat watermelon with friends than alone.", trait: "social" },
  { id: 16, text: "You prefer eating watermelon alone and quietly.", trait: "calm" },
  { id: 17, text: "You eat watermelon slowly, without rushing.", trait: "calm" },
  { id: 18, text: "You calmly spit out watermelon seeds one at a time.", trait: "calm" },
  { id: 19, text: "You eat watermelon late at night.", trait: "chaos" },
  { id: 20, text: "You eat watermelon that's been in the fridge for days without checking it.", trait: "chaos" },
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
