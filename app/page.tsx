import {
  ArrowRight,
  CaretDown,
  ChatCircleDots,
  Cloud,
  Crown,
  Lightning,
  Mouse,
  OrangeSlice,
  Sparkle,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import type { CSSProperties } from "react";
import Link from "next/link";
import InView from "@/components/InView";
import Reveal from "@/components/Reveal";
import { countResponses } from "@/lib/db";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import Watermelon3DLazy from "@/components/Watermelon3DLazy";

type Chip = {
  family: "Juicy" | "Crisp";
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
    <>
      <div className="grain" aria-hidden />

      <main id="main" className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-rind text-cream">
        {/* Backdrop: a wet floor meeting a dark garden, with neon spill. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {/* TODO: optional photographic backdrop (courtyard arch, foliage), 2400x1400, at public/hero-backdrop.jpg */}
          <div className="absolute inset-x-0 bottom-0 h-[46%] bg-[linear-gradient(to_bottom,transparent,rgba(9,30,19,0.85)_45%,#071810)]" />
          <div className="stage-warmth absolute bottom-[4%] left-[50%] h-[30%] w-[58%]" />
          <div className="stage-warmth absolute bottom-[2%] left-[-14%] h-[20%] w-[42%] opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_45%,var(--color-rind-deep)_100%)] opacity-70" />
        </div>

        <SiteNav />

        <section className="relative mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-10 px-5 pt-4 pb-10 sm:px-8 lg:-mb-8 lg:grid-cols-12 lg:gap-4 lg:pt-0 lg:pb-0">
          {/* Copy: eyebrow, headline, subtext, CTAs. */}
          <div className="flex flex-col items-center text-center lg:col-span-6 lg:items-start lg:text-left">
            <Reveal delay={0.05}>
              <p className="mb-6 inline-flex items-center rounded-full bg-pith/[0.08] px-3.5 py-1.5 text-[11px] font-medium tracking-[0.16em] text-pith/80 uppercase ring-1 ring-pith/15 ring-inset">
                Personality, but juicier
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <h1 className="font-display text-[2.75rem] leading-[0.98] font-semibold tracking-[-0.02em] text-balance sm:text-6xl lg:text-[3.125rem] xl:text-[4rem]">
                What kind of <span className="text-flesh">watermelon</span> are you?
              </h1>
            </Reveal>

            <Reveal delay={0.28}>
              <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-pretty text-cream/60">
                Twenty questions, ten results. Find the type under your rind,
                and what it says about how you operate.
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-5 lg:justify-start">
                <Link
                  href="/quiz"
                  className="group inline-flex h-14 items-center gap-4 rounded-full bg-flesh py-2 pr-2 pl-7 font-display text-lg font-semibold text-rind-deep shadow-rind transition-transform duration-500 ease-settle hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-4 focus-visible:ring-offset-rind focus-visible:outline-none active:translate-y-0 active:scale-[0.98]"
                >
                  Get started
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rind-deep/15 transition-transform duration-500 ease-settle group-hover:translate-x-0.5 group-hover:scale-105">
                    <ArrowRight size={18} weight="bold" aria-hidden />
                  </span>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Stage: melon on its plinth, result types called out around it. */}
          <div className="relative mx-auto w-full max-w-[420px] sm:max-w-[560px] lg:col-span-6 lg:max-w-none lg:translate-y-4">
            <div
              aria-hidden
              className="stage-light pointer-events-none absolute top-[42%] left-1/2 aspect-square w-[120%] -translate-x-1/2 -translate-y-1/2"
            />

            {/* CSS entrance, not Motion: keeps the Three.js subtree free of a second animation runtime. */}
            <div className="melon-enter relative">
              <Watermelon3DLazy />
            </div>

            <Reveal delay={0.7} className="pointer-events-none absolute inset-0">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden
                className="h-full w-full text-cream/30"
              >
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

            {CHIPS.map((chip, i) => (
              <Reveal
                key={`${chip.family} ${chip.archetype}`}
                delay={0.6 + i * 0.09}
                distance={14}
                className="pointer-events-none absolute"
                style={chip.style}
              >
                <div
                  className={`scale-[0.8] rounded-[1.25rem] bg-cream/[0.045] p-1 shadow-rind ring-1 ring-cream/[0.07] sm:scale-100 ${chip.anchor === "left" ? "origin-top-left" : "origin-top-right"}`}
                >
                  <div className="flex items-center gap-3 rounded-[calc(1.25rem-0.25rem)] bg-rind-deep/90 py-1.5 pr-1.5 pl-3.5 shadow-[inset_0_1px_0_rgba(251,243,228,0.09)]">
                    <span>
                      <span className="block font-display text-[13px] font-semibold text-flesh">
                        {chip.family}
                      </span>
                      <span className="block text-xs whitespace-nowrap text-cream/70">
                        {chip.archetype}
                      </span>
                    </span>
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-cream/[0.06] text-cream/80 ring-1 ring-cream/[0.08] ring-inset">
                      <chip.icon size={16} aria-hidden />
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Stats and the brand line. */}
        <Reveal delay={0.75} distance={16} className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-2 gap-x-6 gap-y-7 pt-6 lg:grid-cols-[auto_auto_auto_auto_1fr] lg:items-end lg:gap-y-0">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex items-center gap-4 lg:pr-9 ${i > 0 ? "lg:border-l lg:border-cream/10 lg:pl-9" : ""}`}
              >
                <stat.icon size={30} className="shrink-0 text-flesh" aria-hidden />
                <span>
                  <span className="block font-display text-2xl leading-none font-semibold">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-sm text-cream/55">{stat.label}</span>
                </span>
              </div>
            ))}

            <figure className="col-span-2 text-center lg:col-span-1 lg:col-start-5 lg:justify-self-end lg:text-right">
              <blockquote className="text-[15px] text-cream/65 italic">
                &ldquo;Same people, different flavors.&rdquo;
              </blockquote>
              <figcaption className="mt-3 inline-block border-t border-cream/15 pt-3 text-[10px] tracking-[0.22em] text-cream/60 uppercase">
                WatermelonMBTI
              </figcaption>
            </figure>
          </div>
        </Reveal>

        <a
          href="#why"
          className="relative flex flex-col items-center gap-1.5 pt-8 pb-2 text-cream/55 transition-colors duration-300 hover:text-cream focus-visible:text-cream focus-visible:outline-none"
        >
          <Mouse size={22} weight="thin" aria-hidden />
          <span className="text-[10px] tracking-[0.22em] uppercase">Scroll to explore</span>
          <CaretDown size={14} className="scroll-caret" aria-hidden />
        </a>

        <section id="why" className="relative mx-auto w-full max-w-7xl px-5 py-28 sm:px-8 sm:py-40">
          <InView className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl leading-tight font-semibold text-balance sm:text-5xl">
              Why does this exist?
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-pretty text-cream/70 sm:text-xl">
              No grand thesis. No years of research. I just really wanted to know what kind of watermelon eater
              you are. Twenty honest questions about how you actually eat watermelon - that&rsquo;s the whole idea.
            </p>
          </InView>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
