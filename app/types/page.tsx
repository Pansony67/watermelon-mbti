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
    heading: "text-cat-green-ink",
    types: ["The Saviour-Eater", "Shy-Eater", "Quiet-Eater", "Watermelon Dictator", "Creative-Eater"],
  },
  {
    name: "Blue",
    band: "bg-cat-blue",
    heading: "text-cat-blue-ink",
    types: ["Ordinary-Eater", "Boring-Eater", "Introvert-Eater", "Extraordinary-Eater", "Defender-Eater"],
  },
  {
    name: "Yellow",
    band: "bg-cat-yellow",
    heading: "text-cat-yellow-ink",
    types: ["Obsessed-Eater", "The Master Eater", "Energetic-Eater", "Extrovert-Eater", "Flexible-Eater"],
  },
  {
    name: "Purple",
    band: "bg-cat-purple",
    heading: "text-cat-purple-ink",
    types: ["Sus-Eater", "Logic-Eater", "Angry-Eater", "Challenge-Eater", "Innovative-Eater"],
  },
];

export default function TypesPage() {
  return (
    <main id="main" className="relative flex min-h-dvh flex-col bg-paper text-ink">
      <SiteNav />

      <section className="mx-auto flex w-full max-w-7xl flex-col items-center px-5 py-20 text-center sm:px-8 sm:py-24">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.01em] text-balance sm:text-6xl">The 20 Types</h1>
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

      {CATEGORIES.map((category) => (
        <section
          key={category.name}
          aria-labelledby={`cat-${category.name}`}
          className={`w-full px-5 py-16 sm:px-8 sm:py-20 ${category.band}`}
        >
          <div className="mx-auto max-w-7xl">
            <h2
              id={`cat-${category.name}`}
              className={`font-display text-4xl font-semibold sm:text-5xl ${category.heading}`}
            >
              {category.name}
            </h2>

            <ul className="mt-10 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
              {category.types.map((type) => (
                <li key={type} className="text-center">
                  <div className="mx-auto aspect-square w-full max-w-72 overflow-hidden rounded-card bg-paper/60">
                    <TypeImage src={`/images/types/${slug(type)}.png`} alt={type} />
                  </div>
                  <p className="mt-4 font-display text-lg font-semibold text-ink">{type}</p>
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
