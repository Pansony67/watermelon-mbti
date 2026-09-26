import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import CineBand from "@/components/CineBand";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { FAMILIES, TYPES, type Family } from "@/lib/types";

export const metadata: Metadata = {
  title: "The Types | Melonality",
  description: "All 20 watermelon-eater types, grouped into Green, Blue, Yellow and Purple.",
};

/**
 * A sharp grotesque with a width axis for the character select: the giant
 * names and title run slightly expanded, like a game title card. The rest of
 * the site keeps Fredoka and Figtree.
 */
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"] });

/** Band colour and the angle its stage light comes from. Class names written out in full for Tailwind. */
const STAGE: Record<Family, { band: string; lightAt: string }> = {
  Green: { band: "bg-cine-green", lightAt: "12% 0%" },
  Blue: { band: "bg-cine-blue", lightAt: "88% 0%" },
  Yellow: { band: "bg-cine-yellow", lightAt: "50% 0%" },
  Purple: { band: "bg-cine-purple", lightAt: "50% 100%" },
};

/**
 * Each band starts on a slant that alternates direction, and pulls up over
 * the one before so the slant cuts into it rather than leaving a gap.
 */
const SLANTS = ["[clip-path:polygon(0_4vw,100%_0,100%_100%,0_100%)]", "[clip-path:polygon(0_0,100%_4vw,100%_100%,0_100%)]"];

export default function TypesPage() {
  return (
    <main id="main" className="relative flex min-h-dvh flex-col bg-paper text-ink">
      <SiteNav />

      {/* One dark colour-block composition from here to the footer, in both themes. */}
      <div className={`bg-cine-base text-cine-ink ${archivo.className}`}>
        <section className="mx-auto flex w-full max-w-7xl flex-col items-center px-5 pt-20 pb-[calc(4vw+5rem)] text-center sm:px-8 sm:pt-24">
          <h1 className="text-5xl font-extrabold tracking-[-0.03em] text-balance [font-stretch:115%] sm:text-7xl">The 20 Types</h1>
          <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-balance text-cine-ink-2">
            Four families, five eaters in each. One of them is you.
          </p>
          <Link
            href="/quiz"
            className="mt-9 inline-flex h-14 items-center gap-4 rounded-control bg-cine-ink py-2 pr-2 pl-6 text-lg font-semibold text-cine-base transition-colors duration-300 hover:bg-cine-ink/85 focus-visible:ring-2 focus-visible:ring-flesh focus-visible:ring-offset-4 focus-visible:ring-offset-cine-base focus-visible:outline-none"
          >
            Take the quiz
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-flesh text-paper">
              <ArrowRight size={18} weight="bold" aria-hidden />
            </span>
          </Link>
        </section>

        {FAMILIES.map((family, i) => {
          const stage = STAGE[family];
          return (
            <section
              key={family}
              aria-labelledby={`family-${family}`}
              className={`cine-stage relative -mt-[4vw] w-full overflow-clip px-5 pt-[calc(4vw+3rem)] pb-20 sm:px-8 sm:pb-28 ${stage.band} ${SLANTS[i % 2]}`}
              style={{ "--glow": `var(--cine-${family.toLowerCase()}-glow)`, "--light-at": stage.lightAt } as CSSProperties}
            >
              <CineBand family={family} types={TYPES.filter((type) => type.family === family)} intro={i === 0} />
            </section>
          );
        })}
      </div>

      <SiteFooter />
    </main>
  );
}
