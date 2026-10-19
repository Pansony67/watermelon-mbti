import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLink, PrimaryLink } from "@/components/Button";
import { figureWidth } from "@/components/CharacterStage";
import HeroChips from "@/components/HeroChips";
import HowSteps from "@/components/HowSteps";
import ResultPreview from "@/components/ResultPreview";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import Watermelon3DLazy from "@/components/Watermelon3DLazy";
import { countResponses } from "@/lib/db";
import { FAMILIES, FAMILY_INFO, FAMILY_STYLE, TYPES } from "@/lib/types";

export const metadata: Metadata = {
  title: { absolute: "Melonality: What kind of watermelon are you?" },
  alternates: { canonical: "/" },
  description:
    "A 20-question personality quiz about how you eat watermelon. About three minutes, free, no sign-up, and one of 20 oddly specific results.",
};

/** Count refreshes every minute; the page stays static otherwise. */
export const revalidate = 60;

/** Below this many players a count reads as an empty room, not social proof. */
const SHOW_COUNT_FROM = 1000;

/** Answers must stay true to app/privacy and the results page. */
const FAQS: { q: string; a: string }[] = [
  {
    q: "Is this a real personality test?",
    a: "No. It borrows the format of one, but the questions are about watermelon and the science is zero. It is for fun.",
  },
  {
    q: "How long does it take?",
    a: "Twenty statements, one tap each. Most people are done in about three minutes.",
  },
  {
    q: "Do I need an account?",
    a: "No. Everyone starts as a Guest: no sign-up, no email, no name. An account is optional, if you want a Melonality pass.",
  },
  {
    q: "What happens to my answers?",
    a: "We save your answers, family, type and trait scores with nothing that identifies you: no name, no email, no IP address. They only feed the counts on the site.",
  },
  {
    q: "Can I delete my result?",
    a: "Yes. The results page has a “Delete my response” button, which works for as long as you keep that tab open.",
  },
  {
    q: "Does it cost anything?",
    a: "No. It is free, with no ads and no trackers.",
  },
];

export default async function Home() {
  // A vanity stat is not worth a broken landing page: on failure, just leave it out.
  const players = await countResponses().catch((error) => {
    console.error("quiz_responses count failed", error);
    return null;
  });

  return (
    <>
      <SiteNav />
      <main id="main" className="flex-1 overflow-x-clip bg-paper text-ink">
        {/* Hero: the promise, the time cost and one button, all in the first phone screen. */}
        <section className="relative">
          <div
            aria-hidden
            className="stage-warmth pointer-events-none absolute top-[62%] right-[-18%] aspect-square w-[min(110vw,760px)] -translate-y-1/2 lg:top-1/2 lg:right-[-8%]"
          />
          <div className="container-page relative grid items-center gap-6 pt-10 pb-14 sm:pt-14 lg:grid-cols-2 lg:gap-8 lg:pt-10 lg:pb-20">
            <div className="text-center lg:text-left">
              <h1 className="t-display text-ink">
                What kind of <span className="text-flesh">watermelon</span> are you?
              </h1>
              <p className="t-lead mx-auto mt-5 max-w-[34ch] text-ink-2 lg:mx-0">
                Twenty questions about how you eat watermelon. One result that is a little too accurate.
              </p>
              <div className="mt-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-6 lg:justify-start">
                <PrimaryLink href="/quiz" className="w-full sm:w-auto">
                  Take the quiz
                </PrimaryLink>
                <ArrowLink href="/types" className="text-ink">
                  See all 20 types
                </ArrowLink>
              </div>
              <p className="t-label mt-3 text-ink-3">
                Free &middot; No sign-up &middot; About 3 minutes
                {players !== null && players >= SHOW_COUNT_FROM && (
                  <> &middot; {players.toLocaleString("en-US")} people sorted so far</>
                )}
              </p>
            </div>

            {/* Stage: the melon, with four random types called out around it. */}
            <div className="relative mx-auto w-full max-w-[420px] sm:max-w-[560px] lg:max-w-none">
              {/* CSS entrance, not Motion: keeps the Three.js subtree free of a second animation runtime. */}
              <div className="melon-enter relative">
                <Watermelon3DLazy />
              </div>
              <HeroChips />
            </div>
          </div>
        </section>

        {/* What you get: a real result, so the payoff is visible before the first question. */}
        <section aria-labelledby="get" className="border-t border-line bg-paper-2">
          <div className="container-page grid items-center gap-10 pt-16 pb-20 lg:grid-cols-[1fr_minmax(0,28rem)] lg:gap-20 lg:pt-24 lg:pb-28">
            <div>
              <h2 id="get" className="t-h2 text-ink">
                You get a character, not a paragraph.
              </h2>
              <p className="t-lead mt-4 max-w-[46ch] text-ink-2">
                Every result is one of twenty watermelon eaters, from four families. It comes with art worth posting
                and the receipts to back it up.
              </p>
              <ul className="mt-8 space-y-5 border-l-2 border-line pl-5">
                <li>
                  <p className="t-h3 text-ink">Your type</p>
                  <p className="mt-1 text-ink-2">One of twenty, drawn for the group chat.</p>
                </li>
                <li>
                  <p className="t-h3 text-ink">Your family</p>
                  <p className="mt-1 text-ink-2">Heart-led, steady, fired up, or a questioner.</p>
                </li>
                <li>
                  <p className="t-h3 text-ink">Your receipts</p>
                  <p className="mt-1 text-ink-2">Five traits, scored from your own answers.</p>
                </li>
              </ul>
            </div>

            <ResultPreview />
          </div>
        </section>

        {/* How it works: a numbered sequence, not a row of icon boxes. */}
        <section aria-labelledby="how" className="border-t border-line">
          <div className="container-page grid gap-10 pt-16 pb-20 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20 lg:pt-24 lg:pb-28">
            <div>
              <h2 id="how" className="t-h2 text-ink">
                Three minutes, start to finish.
              </h2>
              <p className="t-lead mt-4 text-ink-2">No sign-up, no email, no waiting for results.</p>
              <ArrowLink href="/how-it-works" className="mt-4 text-ink">
                How the scoring works
              </ArrowLink>
            </div>
            <HowSteps />
          </div>
        </section>

        {/* The four families, each on its own stage with its five eaters. */}
        <section aria-labelledby="families" className="border-t border-line bg-paper-2">
          <div className="container-page pt-16 pb-20 lg:pt-24 lg:pb-28">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id="families" className="t-h2 text-ink">
                  Four families. Twenty ways to eat a watermelon.
                </h2>
                <p className="t-lead mt-4 max-w-[48ch] text-ink-2">Your first eight answers decide which one is yours.</p>
              </div>
              <ArrowLink href="/types" className="shrink-0 text-ink">
                Meet all 20
              </ArrowLink>
            </div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {FAMILIES.map((family) => {
                const members = TYPES.filter((t) => t.family === family);
                return (
                  <li key={family}>
                    <Link
                      href={`/types#family-${family}`}
                      className={`group relative isolate flex h-full flex-col overflow-hidden rounded-panel px-6 pt-6 text-cine-ink transition-transform duration-200 ease-settle focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink motion-safe:hover:-translate-y-1 ${FAMILY_STYLE[family].band}`}
                      style={{ "--glow": `var(--cine-${family.toLowerCase()}-glow)` } as CSSProperties}
                    >
                      <span
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-[radial-gradient(60%_70%_at_50%_100%,color-mix(in_srgb,var(--glow)_24%,transparent),transparent_75%)]"
                      />
                      <span className="font-display text-3xl font-extrabold tracking-[-0.03em] text-[color:var(--glow)]">
                        {family}
                      </span>
                      <span className="mt-1 font-semibold">{FAMILY_INFO[family].trait}</span>
                      <span className="mt-1 max-w-[34ch] text-[15px] text-cine-ink-2">{FAMILY_INFO[family].line}</span>
                      {/* The family on its floor. Names are on /types; here the row is a picture. */}
                      <span className="mt-6 flex items-end justify-center gap-1 sm:gap-2">
                        {members.map((type) => (
                          <Image
                            key={type.slug}
                            src={type.image}
                            alt=""
                            width={type.imageWidth}
                            height={type.imageHeight}
                            sizes={`${figureWidth(type, 112)}px`}
                            className="char-rim h-20 w-auto max-w-[22%] object-contain object-bottom sm:h-28"
                          />
                        ))}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* FAQ: everything visible, two columns on wide screens. */}
        <section id="faq" aria-labelledby="faq-title" className="border-t border-line">
          <div className="container-page grid gap-10 pt-16 pb-20 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20 lg:pt-24 lg:pb-28">
            <div>
              <h2 id="faq-title" className="t-h2 text-ink">
                Questions, answered.
              </h2>
              <p className="t-lead mt-4 text-ink-2">
                The long version lives in the{" "}
                <Link href="/privacy" className="font-semibold text-flesh-deep underline underline-offset-4">
                  privacy policy
                </Link>
                .
              </p>
            </div>
            <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {FAQS.map((faq) => (
                <div key={faq.q}>
                  <dt className="t-h3 text-ink">{faq.q}</dt>
                  <dd className="mt-2 leading-relaxed text-pretty text-ink-2">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Closing call to action. */}
        <section aria-labelledby="closing" className="relative overflow-hidden border-t border-line bg-paper-2">
          <div
            aria-hidden
            className="stage-warmth pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[min(120vw,900px)] -translate-x-1/2 -translate-y-1/2"
          />
          <div className="container-page relative flex flex-col items-center pt-20 pb-24 text-center lg:pt-28 lg:pb-32">
            <h2 id="closing" className="t-h1 max-w-[16ch] text-ink">
              Your watermelon is waiting.
            </h2>
            <p className="t-lead mt-4 text-ink-2">Twenty questions. About three minutes. No sign-up.</p>
            <PrimaryLink href="/quiz" className="mt-8 w-full sm:w-auto">
              Take the quiz
            </PrimaryLink>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
