import {
  ArrowRight,
  CaretDown,
  ChatCircleDots,
  Cloud,
  Crown,
  Lightning,
  ListChecks,
  Mouse,
  OrangeSlice,
  PaperPlaneTilt,
  Plus,
  Sparkle,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import type { CSSProperties } from "react";
import Link from "next/link";
import GridBackground from "@/components/GridBackground";
import InView from "@/components/InView";
import Reveal from "@/components/Reveal";
import SeedField from "@/components/SeedField";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import Watermelon3DLazy from "@/components/Watermelon3DLazy";
import { countResponses } from "@/lib/db";

type Family = "Juicy" | "Crisp";

type Chip = {
  family: Family;
  archetype: string;
  icon: Icon;
  /** Position inside the stage, as CSS values. */
  style: CSSProperties;
  /** Which stage edge the chip hangs from; phones scale it down toward that corner. */
  anchor: "left" | "right";
  /** Connector polyline from chip to melon, in a 0-100 stage coordinate space. */
  connector: string;
};

/** A sample of the quiz's ten result types, pinned to the melon with callouts. */
const CHIPS: Chip[] = [
  {
    family: "Juicy",
    archetype: "Daydreamer",
    icon: Cloud,
    style: { left: "4%", top: "6%" },
    anchor: "left",
    connector: "16,16 16,30 29.5,30",
  },
  {
    family: "Crisp",
    archetype: "Overachiever",
    icon: Crown,
    style: { right: "2%", top: "5%" },
    anchor: "right",
    connector: "86,15 86,30 70.5,30",
  },
  {
    family: "Juicy",
    archetype: "Life of the Party",
    icon: UsersThree,
    style: { left: "-2%", top: "62%" },
    anchor: "left",
    connector: "22,67 30,67",
  },
  {
    family: "Crisp",
    archetype: "Chaos Snacker",
    icon: Lightning,
    style: { right: "-3%", top: "58%" },
    anchor: "right",
    connector: "80,63 73,63",
  },
];

/** Juicy reads in coral, Crisp in seed ink, everywhere a family appears. */
const FAMILY_STYLE: Record<Family, { label: string; tint: string; icon: string }> = {
  Juicy: { label: "text-flesh-deep", tint: "bg-blush", icon: "text-flesh" },
  Crisp: { label: "text-ink", tint: "bg-mist", icon: "text-ink" },
};

/** OrangeSlice is the same icon the stats row uses for "10 Unique types". */
const STEPS: { icon: Icon; title: string; body: string }[] = [
  {
    icon: ListChecks,
    title: "Take the quiz",
    body: "Answer 20 honest questions about how you actually eat watermelon. No overthinking, just be honest.",
  },
  {
    icon: OrangeSlice,
    title: "Get your type",
    body: "See which of the 10 unhinged watermelon types you are, your Juicy/Crisp %, and how many other people got the exact same result.",
  },
  {
    icon: PaperPlaneTilt,
    title: "Send it to someone",
    body: "Screenshot your result and share it. Bonus points if it starts an argument.",
  },
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
  { icon: OrangeSlice, value: "10", label: "Unique types" },
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
                Twenty questions, ten results. Find the type under your rind,
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

          {/* Stage: melon on its plinth, result types called out around it. */}
          <div className="relative mx-auto w-full max-w-[420px] sm:max-w-[560px] lg:col-span-6 lg:max-w-none">
            {/* CSS entrance, not Motion: keeps the Three.js subtree free of a second animation runtime. */}
            <div className="melon-enter relative">
              <Watermelon3DLazy />
            </div>

            <Reveal delay={0.7} className="pointer-events-none absolute inset-0">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden className="h-full w-full text-ink/20">
                {CHIPS.map((chip) => (
                  <polyline
                    key={chip.archetype}
                    points={chip.connector}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>
            </Reveal>

            {CHIPS.map((chip, i) => {
              const f = FAMILY_STYLE[chip.family];
              return (
                <Reveal
                  key={`${chip.family} ${chip.archetype}`}
                  delay={0.6 + i * 0.09}
                  distance={14}
                  className="pointer-events-none absolute"
                  style={chip.style}
                >
                  <div
                    className={`flex scale-[0.8] items-center gap-3 rounded-card bg-paper py-2 pr-2 pl-3.5 shadow-card ring-1 ring-line sm:scale-100 ${chip.anchor === "left" ? "origin-top-left" : "origin-top-right"}`}
                  >
                    <span>
                      <span className={`block font-display text-[13px] font-semibold ${f.label}`}>{chip.family}</span>
                      <span className="block text-xs whitespace-nowrap text-ink-2">{chip.archetype}</span>
                    </span>
                    <span className={`grid h-9 w-9 place-items-center rounded-lg ${f.tint} ${f.icon}`}>
                      <chip.icon size={16} aria-hidden />
                    </span>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Stats and the brand line. */}
        <Reveal delay={0.75} distance={16} className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
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

        <a
          href="#how"
          className="relative flex flex-col items-center gap-1.5 pt-10 pb-10 text-ink-3 transition-colors duration-300 hover:text-ink focus-visible:text-ink focus-visible:outline-none"
        >
          <Mouse size={22} weight="thin" aria-hidden />
          <span className="text-[10px] tracking-[0.22em] uppercase">Scroll to explore</span>
          <CaretDown size={14} className="scroll-caret" aria-hidden />
        </a>
      </div>

      {/* How it works: white step cards on the grey band. */}
      <section id="how" className="relative w-full border-y border-line bg-paper-2 px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-display text-3xl font-semibold text-ink sm:text-4xl">How it works</h2>

          <ol className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="relative overflow-hidden rounded-card bg-paper p-7 shadow-card ring-1 ring-line sm:p-8"
              >
                <span aria-hidden className="absolute inset-x-0 top-0 h-0.75 bg-flesh" />
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-4 right-6 font-display text-7xl leading-none font-semibold text-ink/5 tabular-nums"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="grid h-12 w-12 place-items-center rounded-control bg-blush text-flesh">
                  <step.icon size={26} aria-hidden />
                </span>
                <p className="mt-7 text-xs font-semibold tracking-[0.14em] text-flesh-deep uppercase">Step {i + 1}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-ink">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-pretty text-ink-2">{step.body}</p>
              </li>
            ))}
          </ol>
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

      <section id="why" className="relative w-full overflow-hidden border-t border-line bg-paper-2 px-5 py-28 sm:px-8 sm:py-36">
        <SeedField />
        <InView className="relative mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl leading-tight font-semibold text-balance text-ink sm:text-5xl">
            Why does this exist?
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-pretty text-ink-2 sm:text-xl">
            No grand thesis. No years of research. I just really wanted to know what kind of watermelon eater
            you are. Twenty honest questions about how you actually eat watermelon - that&rsquo;s the whole idea.
          </p>
        </InView>
      </section>

      <SiteFooter />
    </main>
  );
}
