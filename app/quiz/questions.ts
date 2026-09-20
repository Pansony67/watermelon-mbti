/**
 * The 20 quiz questions, in presentation order.
 *
 * Answers are recorded on a 7-point scale where **1 is strongest agree** and
 * **7 is strongest disagree** (left to right on screen). No question is
 * reverse-scored: agreeing always pushes toward the `pole`/`group` named here,
 * so a lower value means a stronger pull toward it.
 *
 * Axis A separates Juicy from Crisp. Axis B picks the archetype within it.
 */

export type Group =
  | "Overachiever"
  | "Daydreamer"
  | "Life of the Party"
  | "Old Soul"
  | "Chaos Snacker";

export type Question =
  | { id: number; text: string; axis: "A"; pole: "Juicy" }
  | { id: number; text: string; axis: "B"; group: Group };

export const QUESTIONS: readonly Question[] = [
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
];

/** sessionStorage key holding the 20 answers handed to /quiz/results. */
export const ANSWERS_KEY = "quiz-answers";
