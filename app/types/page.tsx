import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import TypeImage from "@/components/TypeImage";

export const metadata: Metadata = {
  title: "The Types | Melonality",
  description: "All 20 watermelon-eater types, grouped into Green, Blue, Yellow and Purple.",
};

/** "The Master Eater" -> "the-master-eater", the filename under /images/types/. */
const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Class names are written out in full so Tailwind can find them. */
const CATEGORIES = [
  {
    name: "Green",
    band: "bg-cat-green",
    ink: "text-cat-green-ink",
    mark: "text-cat-green-ink/15",
    ground: "bg-cat-green-ink/15",
    types: ["The Saviour-Eater", "Shy-Eater", "Quiet-Eater", "Watermelon Dictator", "Creative-Eater"],
  },
  {
    name: "Blue",
    band: "bg-cat-blue",
    ink: "text-cat-blue-ink",
    mark: "text-cat-blue-ink/15",
    ground: "bg-cat-blue-ink/15",
    types: ["Ordinary-Eater", "Boring-Eater", "Introvert-Eater", "Extraordinary-Eater", "Defender-Eater"],
  },
  {
    name: "Yellow",
    band: "bg-cat-yellow",
    ink: "text-cat-yellow-ink",
    mark: "text-cat-yellow-ink/15",
    ground: "bg-cat-yellow-ink/15",
    types: ["Obsessed-Eater", "The Master Eater", "Energetic-Eater", "Extrovert-Eater", "Flexible-Eater"],
  },
  {
    name: "Purple",
    band: "bg-cat-purple",
    ink: "text-cat-purple-ink",
    mark: "text-cat-purple-ink/15",
    ground: "bg-cat-purple-ink/15",
    types: ["Sus-Eater", "Logic-Eater", "Angry-Eater", "Challenge-Eater", "Innovative-Eater"],
  },
];

/**
 * Each band starts on a slant that alternates direction, and pulls up over
 * the one before so the slant cuts into it rather than leaving a white wedge.
 */
const SLANTS = ["[clip-path:polygon(0_4vw,100%_0,100%_100%,0_100%)]", "[clip-path:polygon(0_0,100%_4vw,100%_100%,0_100%)]"];

export default function TypesPage() {
  return (
    <main id="main" className="relative flex min-h-dvh flex-col bg-paper text-ink">
      <SiteNav />

      <section className="mx-auto flex w-full max-w-7xl flex-col items-center px-5 pt-20 pb-[calc(4vw+5rem)] text-center sm:px-8 sm:pt-24">
        <h1 className="font-display text-5xl font-semibold tracking-[-0.02em] text-balance sm:text-7xl">The 20 Types</h1>
        <Link
          href="/quiz"
          className="mt-9 inline-flex h-14 items-center gap-4 rounded-control bg-ink py-2 pr-2 pl-6 font-display text-lg font-semibold text-paper shadow-card transition-colors duration-300 hover:bg-ink/85 focus-visible:ring-2 focus-visible:ring-flesh focus-visible:ring-offset-4 focus-visible:outline-none"
        >
          Take the quiz
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-flesh text-paper">
            <ArrowRight size={18} weight="bold" aria-hidden />
          </span>
        </Link>
      </section>

      {CATEGORIES.map((category, i) => (
        <section
          key={category.name}
          aria-labelledby={`cat-${category.name}`}
          className={`relative -mt-[4vw] w-full overflow-hidden px-5 pt-[calc(4vw+3rem)] pb-20 sm:px-8 sm:pb-24 ${category.band} ${SLANTS[i % 2]}`}
        >
          {/* The category name is the heading, set huge and faint behind the characters. */}
          <h2
            id={`cat-${category.name}`}
            className={`pointer-events-none text-center font-display text-[24vw] leading-[0.8] font-bold tracking-[-0.03em] select-none lg:text-[17rem] ${category.mark}`}
          >
            {category.name}
          </h2>

          <div className="relative mx-auto -mt-[10vw] max-w-7xl lg:-mt-36">
            <ul className="flex flex-wrap justify-center gap-y-10">
              {category.types.map((type) => (
                <li key={type} className="w-1/2 px-2 text-center sm:w-1/3 sm:px-4 lg:w-1/5">
                  <div className="relative mx-auto aspect-[4/5] w-full max-w-56">
                    <span aria-hidden className={`absolute bottom-1 left-1/2 h-3 w-1/2 -translate-x-1/2 rounded-[50%] blur-[2px] ${category.ground}`} />
                    <TypeImage src={`/images/types/${slug(type)}.png`} alt={type} />
                  </div>
                  <p className={`mt-3 font-display text-lg font-semibold text-balance sm:text-xl ${category.ink}`}>{type}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <SiteFooter />
    </main>
  );
}
