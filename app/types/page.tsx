import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import FamilyBackdrop from "@/components/FamilyBackdrop";
import FamilyHeading from "@/components/FamilyHeading";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { FAMILIES, FAMILY_STYLE, TYPES } from "@/lib/types";

export const metadata: Metadata = {
  title: "The Types | Melonality",
  description: "All 20 watermelon-eater types, grouped into Green, Blue, Yellow and Purple.",
};

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

      {FAMILIES.map((family, i) => {
        const style = FAMILY_STYLE[family];
        return (
          <section
            key={family}
            aria-labelledby={`family-${family}`}
            className={`relative -mt-[4vw] w-full overflow-hidden px-5 pt-[calc(4vw+3rem)] pb-20 sm:px-8 sm:pb-24 ${style.tint} ${SLANTS[i % 2]}`}
          >
            <FamilyBackdrop family={family} />

            {/* The family name is the heading, set huge and faint above the characters. */}
            <FamilyHeading
              family={family}
              id={`family-${family}`}
              className={`pointer-events-none relative text-center font-display text-[24vw] leading-[0.8] font-bold tracking-[-0.03em] select-none lg:text-[17rem] ${style.mark}`}
            />

            <ul className="relative mx-auto mt-6 flex max-w-7xl flex-wrap justify-center gap-y-10 sm:mt-8">
              {TYPES.filter((type) => type.family === family).map((type) => (
                <li key={type.slug} className="w-1/2 px-2 text-center sm:w-1/3 sm:px-4 lg:w-1/5">
                  {/* Cutouts sit straight on the band. Never wider than the ~300px source, so no upscaling blur. */}
                  <Image
                    src={type.image}
                    alt=""
                    width={301}
                    height={250}
                    sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 50vw"
                    // The first band is on screen at load, and on phones its first character is the LCP.
                    loading={i === 0 ? "eager" : "lazy"}
                    className="mx-auto h-auto w-full max-w-[300px] object-contain"
                  />
                  <p className={`mt-3 font-display text-lg font-semibold text-balance sm:text-xl ${style.ink}`}>{type.name}</p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <SiteFooter />
    </main>
  );
}
