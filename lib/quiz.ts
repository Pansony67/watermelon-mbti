/**
 * The questions of the branching test. Everyone answers 20: the 8 shared
 * Phase 1 questions (two per family) pick the family, then that family's 12
 * Phase 2 questions pick one of its five types. Every question also feeds one
 * trait axis: agreeing raises it when `sign` is 1 and lowers it when -1.
 * Scoring lives in scoring.ts; this module is only the data and the answer
 * contract. Texts are final copy: don't reword them here.
 */
import { FAMILIES, type Family, type TraitAxis } from "./types";

export type Question = {
  id: string;
  phase: 1 | 2;
  text: string;
  family: Family;
  /** Phase 1: the family it counts toward. Phase 2: the type slug it counts toward. */
  target: string;
  trait: TraitAxis;
  sign: 1 | -1;
};

type Row = [id: string, target: string, text: string, trait: TraitAxis, sign: 1 | -1];

const PHASE_1_ROWS: Row[] = [
  ["p1-g1", "Green", "You give the best slice to someone else, even when you wanted it.", "social", 1],
  ["p1-g2", "Green", "How a watermelon gets shared matters more to you than how much you get.", "social", 1],
  ["p1-b1", "Blue", "You eat watermelon the same way every single time.", "planning", 1],
  ["p1-b2", "Blue", "You'd rather have a normal, reliable watermelon than try a fancy new variety.", "chaos", -1],
  ["p1-y1", "Yellow", "When there's watermelon around, you get noticeably excited.", "speed", 1],
  ["p1-y2", "Yellow", "You'll happily eat watermelon any time, anywhere, with anyone.", "chaos", 1],
  ["p1-p1", "Purple", "You check a watermelon for anything wrong before you trust it.", "planning", 1],
  ["p1-p2", "Purple", "You like trying watermelon in ways other people think are strange.", "chaos", 1],
];

const PHASE_2_ROWS: Record<Family, Row[]> = {
  Green: [
    ["g-1", "the-saviour-eater", "You save the last slice for someone who hasn't had any yet.", "social", 1],
    ["g-2", "the-saviour-eater", "If someone drops their slice, you give them yours.", "social", 1],
    ["g-3", "the-saviour-eater", "You're usually the one cutting and handing out watermelon to everyone.", "planning", 1],
    ["g-4", "shy-eater", "You try hard not to make any mess when eating watermelon around others.", "mess", -1],
    ["g-5", "shy-eater", "You'd rather not eat watermelon in front of people you don't know well.", "social", -1],
    ["g-6", "quiet-eater", "You eat watermelon slowly and without talking much.", "speed", -1],
    ["g-7", "quiet-eater", "You prefer eating watermelon somewhere calm and quiet.", "social", -1],
    ["g-8", "watermelon-dictator", "There is a correct way to cut a watermelon, and you know what it is.", "planning", 1],
    ["g-9", "watermelon-dictator", "You tell other people how they should be eating their watermelon.", "chaos", -1],
    ["g-10", "watermelon-dictator", "It bothers you when someone cuts the watermelon the wrong way.", "planning", 1],
    ["g-11", "creative-eater", "You cut watermelon into shapes instead of plain slices.", "planning", 1],
    ["g-12", "creative-eater", "You don't mind the kitchen getting messy if the result looks good.", "mess", 1],
  ],
  Blue: [
    ["b-1", "ordinary-eater", "You eat watermelon the normal way: sliced, cold, nothing added.", "chaos", -1],
    ["b-2", "ordinary-eater", "You eat watermelon carefully so you don't get juice everywhere.", "mess", -1],
    ["b-3", "boring-eater", "You've eaten watermelon the exact same way for years.", "planning", 1],
    ["b-4", "boring-eater", "You'd rather eat plain watermelon than any \"special\" version of it.", "chaos", -1],
    ["b-5", "introvert-eater", "You'd rather take your watermelon somewhere quiet than eat it with the group.", "social", -1],
    ["b-6", "introvert-eater", "At a party, you'd stay near the snack table with a slice instead of joining the crowd.", "social", -1],
    ["b-7", "introvert-eater", "You eat watermelon slowly while doing something on your own, like reading or watching a show.", "speed", -1],
    ["b-8", "extraordinary-eater", "When you serve watermelon, it has to look impressive.", "planning", 1],
    ["b-9", "extraordinary-eater", "You can eat watermelon in nice clothes and not spill a single drop.", "mess", -1],
    ["b-10", "defender-eater", "You get protective when someone reaches for your slice.", "social", -1],
    ["b-11", "defender-eater", "You keep your share of watermelon separate so no one else takes it.", "planning", 1],
    ["b-12", "defender-eater", "You'd argue for watermelon if someone called it a boring fruit.", "social", 1],
  ],
  Yellow: [
    ["y-1", "obsessed-eater", "You think about watermelon even when there's none around.", "chaos", 1],
    ["y-2", "obsessed-eater", "You buy watermelon every time you see a good one.", "chaos", 1],
    ["y-3", "obsessed-eater", "You could finish half a watermelon by yourself in one go.", "speed", 1],
    ["y-4", "the-master-eater", "You can tell a sweet watermelon just by looking at it or tapping it.", "planning", 1],
    ["y-5", "the-master-eater", "You can cut a whole watermelon quickly and cleanly.", "mess", -1],
    ["y-6", "energetic-eater", "You eat watermelon fast and move straight on to the next thing.", "speed", 1],
    ["y-7", "energetic-eater", "You eat watermelon while walking, standing, or doing something active.", "mess", 1],
    ["y-8", "energetic-eater", "Watermelon is your go-to snack after sport or exercise.", "speed", 1],
    ["y-9", "extrovert-eater", "Watermelon tastes better when you eat it with a big group.", "social", 1],
    ["y-10", "extrovert-eater", "You start conversations about watermelon with people you just met.", "social", 1],
    ["y-11", "flexible-eater", "You'll eat watermelon however it comes: slices, cubes, juice, whatever.", "planning", -1],
    ["y-12", "flexible-eater", "You don't mind if the watermelon is a bit warm or not perfectly ripe.", "chaos", 1],
  ],
  Purple: [
    ["pu-1", "sus-eater", "You smell or inspect watermelon before eating it, even at a friend's house.", "planning", 1],
    ["pu-2", "sus-eater", "When someone offers you watermelon for free, you wonder why.", "social", -1],
    ["pu-3", "sus-eater", "You don't fully trust watermelon that is sold as \"seedless\".", "chaos", -1],
    ["pu-4", "logic-eater", "You compare the price per kilo before buying a watermelon.", "planning", 1],
    ["pu-5", "logic-eater", "You have an actual reason for the way you cut watermelon.", "planning", 1],
    ["pu-6", "logic-eater", "You'd look up whether swallowing watermelon seeds is safe instead of guessing.", "planning", 1],
    ["pu-7", "angry-eater", "A watermelon that isn't sweet can ruin your mood.", "chaos", 1],
    ["pu-8", "angry-eater", "You get annoyed when watermelon juice gets all over your hands.", "mess", -1],
    ["pu-9", "challenge-eater", "You'd enter a watermelon eating contest to win, not just for fun.", "speed", 1],
    ["pu-10", "challenge-eater", "You'd race someone to finish a slice, mess and all.", "mess", 1],
    ["pu-11", "innovative-eater", "You've tried watermelon with salt, chili, or something unusual.", "chaos", 1],
    ["pu-12", "innovative-eater", "You've made up your own way of cutting or serving watermelon.", "chaos", 1],
  ],
};

export const PHASE_1: Question[] = PHASE_1_ROWS.map(([id, target, text, trait, sign]) => ({
  id,
  phase: 1,
  text,
  family: target as Family,
  target,
  trait,
  sign,
}));

/** All 48 Phase 2 questions, family by family. */
export const PHASE_2: Question[] = FAMILIES.flatMap((family) =>
  PHASE_2_ROWS[family].map(([id, target, text, trait, sign]): Question => ({ id, phase: 2, text, family, target, trait, sign })),
);

/** Questions in one run: always 8 shared plus 12 from one family. */
export const QUESTION_COUNT = 20;

/**
 * One answer on the 7-point scale.
 * 7 = strongly agree, 4 = neutral, 1 = strongly disagree.
 * The UI shows Agree on the left, so buttons run 7 -> 1 left to right.
 */
export type Answer = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** A run's answers, keyed by question id. */
export type Answers = Partial<Record<string, Answer>>;

export function isAnswer(value: unknown): value is Answer {
  return Number.isInteger(value) && (value as number) >= 1 && (value as number) <= 7;
}

/** Where the finished test parks its answers for the results page. */
export const ANSWERS_STORAGE_KEY = "watermelon-mbti:answers";
/** In-progress answers, so a refresh mid-test keeps them. */
export const PROGRESS_STORAGE_KEY = "watermelon-mbti:progress";
