import {
  ArrowRight,
  ChatCircleDots,
  OrangeSlice,
  Plus,
  Sparkle,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import Link from "next/link";
import GridBackground from "@/components/GridBackground";
import InView from "@/components/InView";
import Reveal from "@/components/Reveal";
import SeedField from "@/components/SeedField";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import Watermelon3DLazy from "@/components/Watermelon3DLazy";
import { countResponses } from "@/lib/db";
import { FAMILY_STYLE, TYPES, type EaterType } from "@/lib/types";

/**
 * A product-style annotation: a marker on the melon, a hairline leader, and
 * a label. Coordinates are % of the stage; the poster and the live scene
 * share its 5:4 frame, and markers sit well inside the flesh (y 34-56%) and
 * rind (y 58-78%) regions measured from public/melon-poster.png, so they stay
 * on the fruit as it turns. Re-measure if the camera changes.
 */
type Callout = {
  type: EaterType;
  /** Marker position on the melon. */
  at: [x: number, y: number];
  /** Where the leader ends and the label begins: above the melon or below it. */
  labelY: number;
  /** Which way the label hangs off its leader, outward from the melon. */
  side: "left" | "right";
};

const typeBySlug = (slug: string) => {
  const type = TYPES.find((t) => t.slug === slug);
  if (!type) throw new Error(`Unknown type slug: ${slug}`);
  return type;
};

/** One type from each colour family, two on the flesh and two on the rind. */
const CALLOUTS: Callout[] = [
  { type: typeBySlug("the-saviour-eater"), at: [35, 42], labelY: 16, side: "left" },
  { type: typeBySlug("introvert-eater"), at: [63, 40], labelY: 16, side: "right" },
  { type: typeBySlug("obsessed-eater"), at: [34, 70], labelY: 84, side: "left" },
  { type: typeBySlug("sus-eater"), at: [66, 66], labelY: 84, side: "right" },
];

/** Keep these checkable: each one is a well-documented fact, not a fun myth. */
const FACTS: { label: string; body: string }[] = [
  { label: "92% water", body: "Give or take. It is in the name for a reason, and it is why it runs down your arm." },
  { label: "A berry", body: "Botanically, anyway. Watermelon is a pepo, the same kind of fruit as cucumbers and pumpkins." },
  { label: "4,000+ years", body: "People have grown it at least that long. It turns up in ancient Egyptian tomb paintings." },
  { label: "Square ones", body: "Some Japanese farmers grow cube-shaped watermelons in glass boxes, mostly for display, not eating." },
];

/** Answers must stay true to app/privacy and the results page. */
const FAQS: { q: string; a: string }[] = [
  {
    q: "Is this a real personality test?",
    a: "No. It borrows the format of one, but the questions are about watermelon and there is zero science behind the results. It is for fun.",
  },
  {
    q: "How long does it take?",
    a: "Twenty questions, each answered with one tap on a seven-point scale from agree to disagree. Most people are done in a few minutes.",
  },
  {
    q: "Do I need an account?",
    a: "No. There is no sign-up, no email and no name. Open the quiz and start.",
  },
  {
    q: "What happens to my answers?",
    a: "When you finish, we save your twenty answers, your result and the time, with nothing that identifies you: no name, email, IP address or cookies. The saved results only feed the counts shown on the site.",
  },
  {
    q: "Can I delete my result?",
    a: "Yes. The results page has a \u201cDelete my response\u201d button that removes your saved row, for as long as you keep that tab open.",
  },
  {
    q: "Does it cost anything?",
    a: "No. It is free, with no ads and no trackers.",
  },
];

const STATS: { icon: Icon; value: string; label: string }[] = [
  { icon: OrangeSlice, value: "20", label: "Unique types" },
  { icon: ChatCircleDots, value: "20", label: "Questions" },
  { icon: Sparkle, value: "100%", label: "Juicy insights" },
];

/** Count refreshes every minute; the page stays static otherwise. */
export const revalidate = 60;

export default async function Home() {
  // A vanity stat is not worth a broken landing page: on failure, drop the tile.
  const roasted = await countResponses().catch((error) => {
    console.error("quiz_responses count failed", error);
    return null;
  });
  const stats =
    roasted === null
      ? STATS
      : [...STATS, { icon: UsersThree, value: roasted.toLocaleString("en-US"), label: "already got roasted" }];

  return (
    <main id="main" className="relative flex min-h-dvh flex-col overflow-x-clip bg-paper text-ink">
      <SiteNav />

      {/* Hero */}
      <div className="relative">
        <GridBackground className="grid-fade text-line" />
        <div
          aria-hidden
          className="stage-warmth pointer-events-none absolute top-[48%] right-[-8%] aspect-square w-[min(70vw,760px)] -translate-y-1/2"
        />

        <section className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-5 pt-12 pb-10 sm:px-8 lg:grid-cols-12 lg:gap-4 lg:pt-8 lg:pb-4">
          <div className="flex flex-col items-center text-center lg:col-span-6 lg:items-start lg:text-left">
            <Reveal delay={0.05}>
              <p className="mb-5 text-xs font-semibold tracking-[0.16em] text-flesh-deep uppercase">
                Personality, but juicier
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <h1 className="font-display text-[2.75rem] leading-[0.98] font-semibold tracking-[-0.02em] text-balance text-ink sm:text-6xl lg:text-[3.125rem] xl:text-[4rem]">
                What kind of <span className="text-flesh">watermelon</span> are you?
              </h1>
            </Reveal>

            <Reveal delay={0.28}>
              <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-pretty text-ink-2">
                Twenty questions, twenty types. Find the one under your rind,
                and what it says about how you operate.
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 lg:justify-start">
                <Link
                  href="/quiz"
                  className="inline-flex h-14 items-center gap-4 rounded-control bg-ink py-2 pr-2 pl-6 font-display text-lg font-semibold text-paper shadow-card transition-colors duration-300 hover:bg-ink/85 focus-visible:ring-2 focus-visible:ring-flesh focus-visible:ring-offset-4 focus-visible:outline-none"
                >
                  Get started
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-flesh text-paper">
                    <ArrowRight size={18} weight="bold" aria-hidden />
                  </span>
                </Link>
                <Link
                  href="/types"
                  className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink underline-offset-4 hover:underline"
                >
                  See the types
                  <ArrowRight size={14} weight="bold" aria-hidden />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Stage: the melon, with four result types annotated on it. */}
          <div className="relative mx-auto w-full max-w-[420px] sm:max-w-[560px] lg:col-span-6 lg:max-w-none">
            {/* CSS entrance, not Motion: keeps the Three.js subtree free of a second animation runtime. */}
            <div className="melon-enter relative">
              <Watermelon3DLazy />
            </div>

            {CALLOUTS.map((callout, i) => {
              const f = FAMILY_STYLE[callout.type.family];
              const [x, y] = callout.at;
              const above = callout.labelY < y;
              const delay = 0.8 + i * 0.12;
              return (
                // A zero-width column along the leader, from the marker to the label edge.
                <div
                  key={callout.type.slug}
                  className="pointer-events-none absolute w-0"
                  style={{ left: `${x}%`, top: `${Math.min(y, callout.labelY)}%`, bottom: `${100 - Math.max(y, callout.labelY)}%` }}
                >
                  <span
                    aria-hidden
                    className={`callout-line absolute inset-y-0 -left-px w-px bg-ink/30 ${above ? "origin-bottom" : "origin-top"}`}
                    style={{ animationDelay: `${delay + 0.1}s` }}
                  />
                  <span
                    aria-hidden
                    className={`callout-dot absolute left-0 h-3 w-3 -translate-x-1/2 rounded-full bg-paper shadow-card ring-[3px] ring-current ${f.ink} ${above ? "bottom-0 translate-y-1/2" : "top-0 -translate-y-1/2"}`}
                    style={{ animationDelay: `${delay}s` }}
                  />
                  <Reveal
                    delay={delay + 0.35}
                    distance={8}
                    className={`absolute whitespace-nowrap ${above ? "bottom-full mb-2.5" : "top-full mt-2.5"} ${callout.side === "left" ? "right-0 text-right" : "left-0"}`}
                  >
                    <span className="block font-display text-[13px] leading-tight font-semibold text-ink sm:text-[15px]">
                      {callout.type.name}
                    </span>
                    <span className={`mt-0.5 block text-[11px] font-medium sm:text-xs ${f.ink}`}>{callout.type.family}</span>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </section>

        {/* Stats and the brand line. */}
        <Reveal delay={0.75} distance={16} className="relative mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
          <div className="grid grid-cols-2 gap-x-6 gap-y-7 border-t border-line pt-8 lg:grid-cols-[auto_auto_auto_auto_1fr] lg:items-center lg:gap-y-0">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex items-center gap-4 lg:pr-9 ${i > 0 ? "lg:border-l lg:border-line lg:pl-9" : ""}`}
              >
                <stat.icon size={30} className="shrink-0 text-flesh" aria-hidden />
                <span>
                  <span className="block font-display text-2xl leading-none font-semibold text-ink">{stat.value}</span>
                  <span className="mt-1 block text-sm text-ink-3">{stat.label}</span>
                </span>
              </div>
            ))}

            <figure className="col-span-2 text-center lg:col-span-1 lg:col-start-5 lg:justify-self-end lg:text-right">
              <blockquote className="text-[15px] text-ink-2 italic">&ldquo;Same people, different flavors.&rdquo;</blockquote>
              <figcaption className="mt-3 inline-block border-t border-line pt-3 text-[10px] tracking-[0.22em] text-ink-3 uppercase">
                Melonality
              </figcaption>
            </figure>
          </div>
        </Reveal>

      </div>

      {/* Fruit facts on the grey band. */}
      <section id="facts" className="relative w-full border-y border-line bg-paper-2 px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Know your fruit</h2>
            <p className="mt-4 text-lg text-ink-2">Four true things about watermelon, while you&rsquo;re here.</p>
          </div>

          <dl className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {FACTS.map((fact) => (
              <div key={fact.label} className="relative border-t border-line pt-6">
                <span aria-hidden className="absolute -top-px left-0 h-0.5 w-10 bg-flesh" />
                <dt className="font-display text-3xl font-semibold text-ink">{fact.label}</dt>
                <dd className="mt-3 leading-relaxed text-pretty text-ink-2">{fact.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* FAQ: native disclosure, no script. */}
      <section id="faq" className="relative w-full px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Questions, answered</h2>
            <p className="mt-4 text-lg text-ink-2">
              The short version. The long one is in the{" "}
              <Link href="/privacy" className="font-semibold text-flesh-deep underline-offset-4 hover:underline">
                privacy policy
              </Link>
              .
            </p>
          </div>

          <div className="border-t border-line lg:col-span-7 lg:col-start-6">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-lg font-semibold text-ink transition-colors duration-300 hover:text-flesh-deep focus-visible:text-flesh-deep focus-visible:outline-none sm:text-xl [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <Plus
                    size={20}
                    weight="bold"
                    aria-hidden
                    className="shrink-0 text-flesh transition-transform duration-300 group-open:rotate-45"
                  />
                </summary>
                <p className="-mt-1 max-w-[62ch] pb-6 leading-relaxed text-pretty text-ink-2">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing call to action over the seed field. */}
      <section className="relative w-full overflow-hidden border-t border-line bg-paper-2 px-5 py-28 sm:px-8 sm:py-36">
        <SeedField />
        <InView className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="font-display text-3xl leading-tight font-semibold text-balance text-ink sm:text-5xl">
            Ready when you are.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-pretty text-ink-2 sm:text-xl">
            Twenty questions, a few minutes, and one very specific watermelon at the end.
          </p>
          <Link
            href="/quiz"
            className="mt-10 inline-flex h-14 items-center gap-4 rounded-control bg-ink py-2 pr-2 pl-6 font-display text-lg font-semibold text-paper shadow-card transition-colors duration-300 hover:bg-ink/85 focus-visible:ring-2 focus-visible:ring-flesh focus-visible:ring-offset-4 focus-visible:outline-none"
          >
            Take the quiz
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-flesh text-paper">
              <ArrowRight size={18} weight="bold" aria-hidden />
            </span>
          </Link>
        </InView>
      </section>

      <SiteFooter />
    </main>
  );
}
