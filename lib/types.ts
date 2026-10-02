/**
 * The 20 watermelon-eater types, in display order. Single source of truth for
 * every page that shows them and for the quiz result. How answers map to a
 * type lives in lib/scoring.ts.
 */

export type Family = "Green" | "Blue" | "Yellow" | "Purple";

/**
 * The five axes every type is drawn on, in radar order. Trait scores are a
 * static profile for now; the quiz results page will later plot the player's
 * own scores on these same axes, so keep the keys stable.
 */
export const TRAIT_AXES = ["mess", "speed", "social", "planning", "chaos"] as const;
export type TraitAxis = (typeof TRAIT_AXES)[number];

/** Plain-word axis names for charts and copy. */
export const TRAIT_LABEL: Record<TraitAxis, string> = {
  mess: "Messiness",
  speed: "Speed",
  social: "Social",
  planning: "Planning",
  chaos: "Chaos",
};

export type EaterType = {
  slug: string;
  name: string;
  family: Family;
  /** Transparent PNG cutout, about 300x250, under public/images/types/. */
  image: string;
  /** One line, under 12 words. */
  tagline: string;
  /** 60-90 words on how they actually eat watermelon. */
  description: string;
  habits: [string, string, string];
  /** 0-100 on each axis. Each type has one clear top trait and no two profiles match. */
  traits: Record<TraitAxis, number>;
};

export const FAMILIES: Family[] = ["Green", "Blue", "Yellow", "Purple"];

/**
 * Each family's flavour, so the copy can lean on it: Green deals with the rind,
 * Blue keeps it cold and steady, Yellow eats it loud in the summer sun, and
 * Purple does its best work after dark.
 */
const ROSTER: Record<Family, Omit<EaterType, "family" | "image">[]> = {
  Green: [
    {
      slug: "the-saviour-eater",
      name: "The Saviour-Eater",
      tagline: "Hands out every slice and keeps the end piece.",
      description:
        "The Saviour-Eater cannot watch anyone go without melon. They cut, they serve, they wipe the counter, and they quietly take the end piece that is mostly rind, because someone has to. By the time they sit down their hands are sticky to the wrist and the good slices are gone. Like the rest of the Green family, they deal with the rind so nobody else has to. They would like you to know they are fine.",
      habits: [
        "Serves everyone before taking a single bite.",
        "Always ends up with the slice that is mostly rind.",
        "Rescues dropped pieces before they hit the floor.",
      ],
      traits: { mess: 70, speed: 50, social: 92, planning: 30, chaos: 12 },
    },
    {
      slug: "shy-eater",
      name: "Shy-Eater",
      tagline: "Waits until the kitchen is empty, then takes one small slice.",
      description:
        "The Shy-Eater would love some watermelon, thank you, but not if anyone is watching. They wait for the room to clear, take one modest slice, and eat it facing the wall in small, silent bites so nobody hears the crunch. Not a single drop lands anywhere. The timing is planned like a heist. In the Green family they leave the rind cleaner than the plate. Offer them a second piece and they will say no, then think about it for a week.",
      habits: [
        "Eats facing away from the room.",
        "Takes the smallest slice so nobody notices.",
        "Says no to seconds and regrets it later.",
      ],
      traits: { mess: 12, speed: 20, social: 8, planning: 62, chaos: 15 },
    },
    {
      slug: "quiet-eater",
      name: "Quiet-Eater",
      tagline: "Eats in total silence, one seed at a time.",
      description:
        "The Quiet-Eater sits down with one slice and treats it like a ceremony. No phone, no talking, no hurry. Each seed is removed by hand and placed in a neat line on the plate, and the slice somehow takes forty minutes. Ask them a question halfway through and you will get a nod, eventually. Of the Green family, they are the one who eats right down to the pale rind and stops exactly there. It is peaceful to watch. It is also very slow.",
      habits: [
        "Lines up the seeds in a row on the plate.",
        "Takes forty minutes to finish one slice.",
        "Answers questions with a nod, a minute later.",
      ],
      traits: { mess: 10, speed: 6, social: 14, planning: 40, chaos: 18 },
    },
    {
      slug: "watermelon-dictator",
      name: "Watermelon Dictator",
      tagline: "Decides how the melon is cut, served, and eaten.",
      description:
        "The Watermelon Dictator does not share watermelon. They allocate it. Before anyone gets a slice there is a cutting plan, a serving order, and a firm rule about where the seeds go. Triangles are standard issue; cubes require approval. Like every Green, they take the rind seriously, and anyone who leaves red on it will hear about it. They eat fast and clean so they can supervise. Everyone gets a fair share, which they decided, and nobody may complain about it.",
      habits: [
        "Hands out slices in a fixed order.",
        "Bans leaving red on the rind.",
        "Finishes first so they can supervise.",
      ],
      traits: { mess: 15, speed: 68, social: 72, planning: 95, chaos: 8 },
    },
    {
      slug: "creative-eater",
      name: "Creative-Eater",
      tagline: "Turns every slice into art, then photographs it.",
      description:
        "The Creative-Eater cannot just eat a slice. They carve it into a star, arrange the pieces into a face, and photograph it from three angles before anyone can touch it. There is no plan; the idea arrives mid-cut. For a Green, the rind is not waste but a canvas, so expect boats, bowls, and the occasional hat. By the time the photo is right, the melon is warm. They eat it anyway and post it with a caption about the light.",
      habits: [
        "Photographs the melon before the first bite.",
        "Carves leftover rind into bowls and boats.",
        "Lets it go warm while getting the angle right.",
      ],
      traits: { mess: 55, speed: 35, social: 80, planning: 25, chaos: 50 },
    },
  ],
  Blue: [
    {
      slug: "ordinary-eater",
      name: "Ordinary-Eater",
      tagline: "One triangle, eaten at a normal pace, with a napkin.",
      description:
        "The Ordinary-Eater buys the same size watermelon from the same shop every week and cuts it into the triangles everyone pictures when they hear the word. They eat at a normal pace, use one napkin, and spit the seeds into the bin like a reasonable adult. In the Blue family, that counts as a personality. Ask them how they eat watermelon and they will ask what you mean. Nothing about it is wrong. Nothing about it is a story, either.",
      habits: [
        "Buys the same watermelon from the same shop.",
        "Cuts the classic triangle, every time.",
        "Uses exactly one napkin.",
      ],
      traits: { mess: 42, speed: 48, social: 45, planning: 60, chaos: 12 },
    },
    {
      slug: "boring-eater",
      name: "Boring-Eater",
      tagline: "Pre-cut cubes, a fork, and a container with a label.",
      description:
        "The Boring-Eater eats watermelon from a labelled container, with a fork, at their desk, at the same time every afternoon. The cubes are cut on Sunday night and portioned for the week. No juice reaches the keyboard. No seed is ever discussed. As Blue as they come, they keep the melon cold, the routine colder, and the conversation at zero. They will tell you it is the most efficient way to eat fruit. They are right, and nobody wants to hear it.",
      habits: [
        "Cuts a week of cubes on Sunday night.",
        "Eats with a fork at their desk.",
        "Labels the container with the date.",
      ],
      traits: { mess: 8, speed: 40, social: 20, planning: 70, chaos: 5 },
    },
    {
      slug: "introvert-eater",
      name: "Introvert-Eater",
      tagline: "Half a melon, one spoon, a closed door.",
      description:
        "The Introvert-Eater takes half a watermelon and a spoon to their room and closes the door. In private, the manners come off. Juice runs down the wrist, the spoon goes in at strange angles, and nobody is there to see it, which is the point. They eat slowly because nothing is waiting for them. The Blue family likes its melon cold and calm, and this one adds dim light. They come out an hour later with an empty shell and no comment.",
      habits: [
        "Eats straight from the half shell with a spoon.",
        "Only gets messy with the door closed.",
        "Returns the empty shell without explanation.",
      ],
      traits: { mess: 82, speed: 30, social: 8, planning: 22, chaos: 45 },
    },
    {
      slug: "extraordinary-eater",
      name: "Extraordinary-Eater",
      tagline: "Cuts watermelon like it is a stage show.",
      description:
        "The Extraordinary-Eater does not cut a watermelon. They present it. There is a big knife, a crowd, and a single clean cut that opens the melon like a curtain. Slices are handed out with a flourish, and they eat their own fast, messily, and with eye contact. Every move was rehearsed. For a Blue they are oddly loud, but the routine is steady: same trick, every summer, same applause. Ask for a quiet slice and they will look hurt.",
      habits: [
        "Opens the melon in one rehearsed cut.",
        "Waits for applause before serving.",
        "Eats their own slice with full eye contact.",
      ],
      traits: { mess: 75, speed: 70, social: 95, planning: 80, chaos: 15 },
    },
    {
      slug: "defender-eater",
      name: "Defender-Eater",
      tagline: "Guards their slice like it is the last one.",
      description:
        "The Defender-Eater has a slice and a perimeter. They pick a seat with their back to the wall, keep one arm around the plate, and eat quickly before anyone can ask for a bite. The best melon was chosen in advance and hidden at the back of the fridge, behind the vegetables, where Blue family melons go to stay cold and safe. Nobody has ever actually tried to take their slice. They are ready anyway.",
      habits: [
        "Keeps one arm around the plate.",
        "Hides the good melon behind the vegetables.",
        "Eats fast in case someone asks for a bite.",
      ],
      traits: { mess: 40, speed: 72, social: 18, planning: 85, chaos: 10 },
    },
  ],
  Yellow: [
    {
      slug: "obsessed-eater",
      name: "Obsessed-Eater",
      tagline: "Has eaten watermelon every day since June.",
      description:
        "The Obsessed-Eater has eaten watermelon every day since June and sees no reason to stop. Breakfast, after lunch, at midnight standing at the open fridge. They lost count of the slices weeks ago, and the juice stains are now part of the shirt. Friends tried an intervention with smoothies and sorbet, but all of it was also watermelon. Yellow suits them, the colour of a long summer they refuse to let end. They have opinions about seed density.",
      habits: [
        "Eats watermelon at every meal, including midnight.",
        "Keeps a backup melon for when the first runs out.",
        "Has strong opinions about seed density.",
      ],
      traits: { mess: 80, speed: 75, social: 45, planning: 20, chaos: 92 },
    },
    {
      slug: "the-master-eater",
      name: "The Master Eater",
      tagline: "Eats with perfect technique and expects you to learn it.",
      description:
        "The Master Eater has studied the slice. They can pick a ripe melon by sound from across the market, split it with one strike, and clear a wedge in four big bites that follow the grain. Juice goes where they allow it to go. They eat with their hands, because forks are for students. Among the loud Yellow family they are the calm one in the sun, and they will correct your grip without being asked. Then they will show you again.",
      habits: [
        "Picks a ripe melon by knocking once.",
        "Clears a wedge in exactly four bites.",
        "Corrects your grip without being asked.",
      ],
      traits: { mess: 70, speed: 60, social: 45, planning: 90, chaos: 12 },
    },
    {
      slug: "energetic-eater",
      name: "Energetic-Eater",
      tagline: "Finishes a slice before you have found a napkin.",
      description:
        "The Energetic-Eater eats watermelon at a jog. A slice disappears in about six seconds, the rind lands in the bin from across the room, and they are already reaching for the next one. Seeds are not removed, they are outrun. They eat standing up, usually outside, usually in direct Yellow family sunshine after doing something sweaty. Juice gets everywhere and they do not notice, because they have already left. Blink and you miss the whole slice.",
      habits: [
        "Finishes a slice in under ten seconds.",
        "Eats standing up, often in the middle of something.",
        "Throws the rind at the bin from across the room.",
      ],
      traits: { mess: 78, speed: 96, social: 50, planning: 15, chaos: 30 },
    },
    {
      slug: "extrovert-eater",
      name: "Extrovert-Eater",
      tagline: "Cannot eat watermelon alone. Has never tried.",
      description:
        "The Extrovert-Eater cannot eat watermelon alone and has never tried. One melon becomes a picnic, the picnic becomes a party, and somebody always ends up holding a speaker. They talk with a slice in hand, wave it to make a point, and only remember to eat it when a seed hits someone. In true Yellow fashion it all happens outdoors, loudly, in the sun. They will text you a photo of the melon as an invitation. You were already invited.",
      habits: [
        "Turns one melon into a party.",
        "Talks with a slice in hand for twenty minutes.",
        "Sends a photo of the melon as an invitation.",
      ],
      traits: { mess: 55, speed: 65, social: 97, planning: 40, chaos: 55 },
    },
    {
      slug: "flexible-eater",
      name: "Flexible-Eater",
      tagline: "Any time, any shape, any utensil. No rules, no complaints.",
      description:
        "The Flexible-Eater will eat watermelon at any hour, in any shape, with whatever is in reach. Triangles, cubes, balls, a hollowed half with a straw. Spoon, fork, or bare hands. All fine. Breakfast or two in the morning, also fine. Out of plates, they will eat it off the rind in a position that should not be comfortable. They never plan and never mind. The Yellow family runs on summer energy, and this one simply bends with it.",
      habits: [
        "Eats whatever shape you cut, with whatever is nearby.",
        "Has no fixed watermelon hour.",
        "Never complains about the slice they got.",
      ],
      traits: { mess: 50, speed: 45, social: 70, planning: 10, chaos: 85 },
    },
  ],
  Purple: [
    {
      slug: "sus-eater",
      name: "Sus-Eater",
      tagline: "Nobody saw them eat it. Half the melon is gone.",
      description:
        "The Sus-Eater is never seen eating watermelon, and yet the melon keeps getting smaller. Somewhere around two in the morning a fridge door opens, a knife moves very quietly, and a wedge disappears. By breakfast the cut side has been turned to face the wall. Like everyone in the Purple family, they do their best work after dark. When asked, they say they do not even like watermelon that much. There are seeds in their coat pocket.",
      habits: [
        "Turns the cut side of the melon to the wall.",
        "Eats at two in the morning by fridge light.",
        "Denies everything. Has seeds in their pocket.",
      ],
      traits: { mess: 45, speed: 50, social: 15, planning: 25, chaos: 88 },
    },
    {
      slug: "logic-eater",
      name: "Logic-Eater",
      tagline: "Has read three studies on picking a ripe watermelon.",
      description:
        "The Logic-Eater does not guess. They check the field spot for yellow, tap for a hollow sound, weigh the melon against its size, and reach a conclusion. At home it is cut into pieces of equal size, the seeds are counted, and the ratio is noted. They eat slowly and leave no evidence. Purple fits them, the colour of a detective reading late into the night, though the only case they solve is which melon is ripe. They are always right.",
      habits: [
        "Inspects the field spot before buying.",
        "Cuts pieces of equal size, then checks.",
        "Counts the seeds, for the record.",
      ],
      traits: { mess: 10, speed: 18, social: 20, planning: 97, chaos: 22 },
    },
    {
      slug: "angry-eater",
      name: "Angry-Eater",
      tagline: "Splits the melon with one strike and no patience.",
      description:
        "The Angry-Eater does not cut watermelon. They break it. A melon on the counter is a problem, and problems are solved with one heavy strike and both hands. The pieces are uneven and they do not care. They eat fast, bite hard, and spit seeds with intent. The mess is total. This is a Purple family eater, so it often happens late, after a long day, when the melon was the only thing in the fridge that did not argue back.",
      habits: [
        "Opens the melon by force, not by knife.",
        "Spits seeds at full power.",
        "Eats angrily, then feels much better.",
      ],
      traits: { mess: 95, speed: 85, social: 20, planning: 35, chaos: 75 },
    },
    {
      slug: "challenge-eater",
      name: "Challenge-Eater",
      tagline: "Turns every slice into a race and keeps score.",
      description:
        "The Challenge-Eater cannot see two slices without starting a race. Fastest slice, most slices, longest seed spit, no hands: every round is a contest, and they are keeping score. They eat in big, fast bites with juice everywhere, and they want witnesses. Losing is not discussed. In Purple family style the rematches run late into the night, until the melon is gone and someone has to admit defeat. It will not be them. They are already training for next summer.",
      habits: [
        "Challenges anyone nearby to a speed round.",
        "Keeps a running score of slices eaten.",
        "Demands a rematch after losing.",
      ],
      traits: { mess: 82, speed: 92, social: 75, planning: 20, chaos: 55 },
    },
    {
      slug: "innovative-eater",
      name: "Innovative-Eater",
      tagline: "Grilled, salted, frozen, or fizzy: every slice is an experiment.",
      description:
        "The Innovative-Eater has never eaten watermelon the same way twice. Last week it was grilled with salt. This week it is frozen into a block and shaved with a gadget they built themselves. They have tried chili, feta, soda water, and something involving a drill. Most experiments happen after midnight, which is very Purple of them, and the kitchen shows it. About one idea in ten is brilliant. They will make you try all ten.",
      habits: [
        "Adds salt, chili, or feta to see what happens.",
        "Builds tools nobody needed to cut watermelon.",
        "Runs kitchen experiments after midnight.",
      ],
      traits: { mess: 55, speed: 60, social: 45, planning: 72, chaos: 90 },
    },
  ],
};

export const TYPES: EaterType[] = FAMILIES.flatMap((family) =>
  ROSTER[family].map((type) => ({ ...type, family, image: `/images/types/${type.slug}.png` })),
);

/** The axis a type scores highest on. */
export const topTrait = (type: EaterType): TraitAxis =>
  TRAIT_AXES.reduce((best, axis) => (type.traits[axis] > type.traits[best] ? axis : best));

/**
 * Family colours: a soft `tint` for bands and tiles, and an `ink` that passes
 * AA on the tint and on paper in both themes. `hoverRing` and `hoverTile`
 * are the landing-page chip's hover state: ring and icon tile take the ink.
 * `band` is the family's dark stage colour on /types and the type pages, the
 * same in both themes. Written out in full so Tailwind can find the class names.
 */
export const FAMILY_STYLE: Record<Family, { tint: string; ink: string; mark: string; hoverRing: string; hoverTile: string; band: string }> = {
  Green: {
    tint: "bg-cat-green",
    ink: "text-cat-green-ink",
    mark: "text-cat-green-ink/15",
    hoverRing: "hover:ring-cat-green-ink/40",
    hoverTile: "group-hover:bg-cat-green-ink",
    band: "bg-cine-green",
  },
  Blue: {
    tint: "bg-cat-blue",
    ink: "text-cat-blue-ink",
    mark: "text-cat-blue-ink/15",
    hoverRing: "hover:ring-cat-blue-ink/40",
    hoverTile: "group-hover:bg-cat-blue-ink",
    band: "bg-cine-blue",
  },
  Yellow: {
    tint: "bg-cat-yellow",
    ink: "text-cat-yellow-ink",
    mark: "text-cat-yellow-ink/15",
    hoverRing: "hover:ring-cat-yellow-ink/40",
    hoverTile: "group-hover:bg-cat-yellow-ink",
    band: "bg-cine-yellow",
  },
  Purple: {
    tint: "bg-cat-purple",
    ink: "text-cat-purple-ink",
    mark: "text-cat-purple-ink/15",
    hoverRing: "hover:ring-cat-purple-ink/40",
    hoverTile: "group-hover:bg-cat-purple-ink",
    band: "bg-cine-purple",
  },
};
