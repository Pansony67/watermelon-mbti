import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { PrimaryLink } from "@/components/Button";
import CineBand from "@/components/CineBand";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { FAMILIES, FAMILY_STYLE, TYPES, type Family } from "@/lib/types";

export const metadata: Metadata = {
  title: "All 20 types | Melonality",
  description:
    "Meet all 20 watermelon eaters in four families: heart-led Green, steady Blue, fired-up Yellow and questioning Purple. Tap one to see what it says about you.",
};

/** The angle each band's stage light comes from. */
const LIGHT_AT: Record<Family, string> = { Green: "12% 0%", Blue: "88% 0%", Yellow: "50% 0%", Purple: "50% 100%" };

/**
 * Each band starts on a slant that alternates direction, and pulls up over
 * the one before so the slant cuts into it rather than leaving a gap.
 */
const SLANTS = ["[clip-path:polygon(0_4vw,100%_0,100%_100%,0_100%)]", "[clip-path:polygon(0_0,100%_4vw,100%_100%,0_100%)]"];

export default function TypesPage() {
  return (
    <>
      <SiteNav />

      {/* One dark colour-block composition from here to the footer, in both themes. */}
      <main id="main" className="flex-1 bg-cine-base text-cine-ink">
        <section className="container-page flex flex-col items-center pt-16 pb-[calc(4vw+4rem)] text-center sm:pt-24">
          <h1 className="t-display">The 20 types</h1>
          <p className="t-lead mt-5 max-w-[40ch] text-cine-ink-2">
            Four families, five eaters in each. Tap anyone to meet them. One of them is you.
          </p>
          <PrimaryLink href="/quiz" className="mt-8 w-full sm:w-auto">
            Find out which
          </PrimaryLink>
        </section>

        {FAMILIES.map((family, i) => (
          <section
            key={family}
            aria-labelledby={`family-${family}`}
            className={`cine-stage relative -mt-[4vw] w-full overflow-clip px-5 pt-[calc(4vw+3rem)] pb-20 sm:px-8 sm:pb-28 ${FAMILY_STYLE[family].band} ${SLANTS[i % 2]}`}
            style={{ "--glow": `var(--cine-${family.toLowerCase()}-glow)`, "--light-at": LIGHT_AT[family] } as CSSProperties}
          >
            <CineBand family={family} types={TYPES.filter((type) => type.family === family)} intro={i === 0} />
          </section>
        ))}
      </main>

      <SiteFooter />
    </>
  );
}
