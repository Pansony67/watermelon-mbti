import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ChartBar,
  IdentificationCard,
  ListChecks,
  OrangeSlice,
  PaperPlaneTilt,
  Percent,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "How it works | Melonality",
  description:
    "Twenty statements, a seven-point scale, and two parts that add up to your watermelon type. How the Melonality quiz works.",
};

/** OrangeSlice is the same icon the landing stats row uses for "Unique types". */
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

/** Mirrors lib/questions.ts and lib/scoring.ts: update this copy if the scoring changes. */
const PARTS: { meta: string; title: string; body: string }[] = [
  {
    meta: "Part one · 6 statements",
    title: "Juicy or Crisp",
    body: "How you physically eat it: bite size, speed, sticky hands, how many slices. Agreeing leans you Juicy, disagreeing leans you Crisp, and your result says by how much.",
  },
  {
    meta: "Part two · 14 statements",
    title: "Your habits",
    body: "How you buy, cut, share, store and forget watermelon. The statements fall into five habit profiles, and the one you agree with most, on average, wins.",
  },
  {
    meta: "Together",
    title: "Your type",
    body: "Your side from part one plus your habit profile from part two makes your type. Nothing is reverse-scored and nothing is hidden: what you tap is what counts.",
  },
];

/** The quiz's answer scale, drawn static. Same sizes and colours as components/QuizFlow.tsx. */
const SCALE: { label: string; disc: string }[] = [
  { label: "Strongly agree", disc: "h-10 w-10 border-flesh sm:h-14 sm:w-14" },
  { label: "Agree", disc: "h-9 w-9 border-flesh sm:h-12 sm:w-12" },
  { label: "Slightly agree", disc: "h-7 w-7 border-flesh sm:h-10 sm:w-10" },
  { label: "Neutral", disc: "h-6 w-6 border-ink-3 sm:h-8 sm:w-8" },
  { label: "Slightly disagree", disc: "h-7 w-7 border-ink sm:h-10 sm:w-10" },
  { label: "Disagree", disc: "h-9 w-9 border-ink sm:h-12 sm:w-12" },
  { label: "Strongly disagree", disc: "h-10 w-10 border-ink sm:h-14 sm:w-14" },
];

const DISC = "block rounded-full border-2"; // unslop-ignore: the answer scale is circles by definition, as in QuizFlow

const TIPS: { title: string; body: string }[] = [
  {
    title: "Answer for the real you",
    body: "How you actually eat watermelon, not how you would like to. Nobody is watching.",
  },
  {
    title: "Go with your first instinct",
    body: "There is no timer. Your first reaction to a statement is usually the honest one.",
  },
  {
    title: "Save Neutral for true ties",
    body: "The middle circle is the smallest for a reason. Lean one way whenever you can.",
  },
];

const RESULT: { icon: Icon; title: string; body: string }[] = [
  {
    icon: IdentificationCard,
    title: "Your type",
    body: "A name and a short, affectionate roast of how you eat.",
  },
  {
    icon: Percent,
    title: "Your lean",
    body: "How Juicy or how Crisp you are, as a percentage from part one.",
  },
  {
    icon: ChartBar,
    title: "How rare it is",
    body: "The share of all players who got the exact same result, counted live.",
  },
];

export default function HowItWorksPage() {
  return (
    <main id="main" className="relative flex min-h-dvh flex-col bg-paper text-ink">
      <SiteNav />

      <section className="mx-auto flex w-full max-w-7xl flex-col items-center px-5 py-20 text-center sm:px-8 sm:py-24">
        <h1 className="font-display text-5xl font-semibold tracking-[-0.02em] text-balance sm:text-7xl">How it works</h1>
        <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-pretty text-ink-2">
          Three steps, a few minutes, and one very specific watermelon at the end.
        </p>
      </section>

      {/* The three steps: white cards on the grey band. */}
      <section aria-label="The three steps" className="w-full border-y border-line bg-paper-2 px-5 py-20 sm:px-8 sm:py-24">
        <ol className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3 md:gap-6">
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
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink">{step.title}</h2>
              <p className="mt-3 leading-relaxed text-pretty text-ink-2">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* What is measured. */}
      <section className="w-full px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">What the quiz measures</h2>
            <p className="mt-4 text-lg leading-relaxed text-pretty text-ink-2">
              Twenty statements in two parts. Each part answers one question about you.
            </p>
          </div>

          <ol className="border-t border-line lg:col-span-7 lg:col-start-6">
            {PARTS.map((part) => (
              <li key={part.title} className="grid gap-2 border-b border-line py-8 sm:grid-cols-[12rem_1fr] sm:gap-8">
                <p className="text-sm font-semibold text-flesh-deep sm:pt-1.5">{part.meta}</p>
                <div>
                  <h3 className="font-display text-2xl font-semibold text-ink">{part.title}</h3>
                  <p className="mt-2 leading-relaxed text-pretty text-ink-2">{part.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* How to answer: the scale, then tips. */}
      <section className="w-full border-y border-line bg-paper-2 px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">How to answer</h2>
            <p className="mt-4 text-lg leading-relaxed text-pretty text-ink-2">
              Every statement gets one tap on a seven-point scale, from Strongly agree to Strongly disagree.
            </p>
          </div>

          <figure className="mx-auto mt-12 max-w-3xl rounded-panel bg-paper px-5 py-8 shadow-card ring-1 ring-line sm:px-10 sm:py-10">
            <ul className="flex items-center justify-between gap-1">
              {SCALE.map((step) => (
                <li key={step.label} className="grid flex-1 place-items-center">
                  <span className={`${DISC} ${step.disc}`} />
                  <span className="sr-only">{step.label}</span>
                </li>
              ))}
            </ul>
            <figcaption aria-hidden className="mt-5 flex justify-between font-display text-base font-semibold sm:text-lg">
              <span className="text-flesh-deep">Agree</span>
              <span className="text-ink-3">Neutral</span>
              <span className="text-ink">Disagree</span>
            </figcaption>
          </figure>

          <ul className="mx-auto mt-14 grid max-w-5xl gap-x-8 gap-y-10 md:grid-cols-3">
            {TIPS.map((tip) => (
              <li key={tip.title} className="relative border-t border-line pt-6">
                <span aria-hidden className="absolute -top-px left-0 h-0.5 w-10 bg-flesh" />
                <h3 className="font-display text-xl font-semibold text-ink">{tip.title}</h3>
                <p className="mt-2 leading-relaxed text-pretty text-ink-2">{tip.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What the result page shows. */}
      <section className="w-full px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">What you get at the end</h2>
            <p className="mt-4 text-lg leading-relaxed text-pretty text-ink-2">
              One result page, three things on it. No email required to see it.
            </p>
          </div>

          <ul className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
            {RESULT.map((item) => (
              <li key={item.title} className="rounded-card bg-paper p-7 ring-1 ring-line sm:p-8">
                <item.icon size={30} className="text-flesh" aria-hidden />
                <h3 className="mt-6 font-display text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-pretty text-ink-2">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="w-full border-t border-line bg-paper-2 px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="font-display text-3xl leading-tight font-semibold text-balance text-ink sm:text-5xl">
            See it for yourself.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-pretty text-ink-2">Twenty statements. No sign-up.</p>
          <Link
            href="/quiz"
            className="mt-10 inline-flex h-14 items-center gap-4 rounded-control bg-ink py-2 pr-2 pl-6 font-display text-lg font-semibold text-paper shadow-card transition-colors duration-300 hover:bg-ink/85 focus-visible:ring-2 focus-visible:ring-flesh focus-visible:ring-offset-4 focus-visible:outline-none"
          >
            Take the quiz
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-flesh text-paper">
              <ArrowRight size={18} weight="bold" aria-hidden />
            </span>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
