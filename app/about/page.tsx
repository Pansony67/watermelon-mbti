import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Gift, GithubLogo, ShieldCheck, X } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import SeedField from "@/components/SeedField";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { OPERATOR } from "@/lib/legal";

export const metadata: Metadata = {
  title: "About | Melonality",
  description: "Why a watermelon personality quiz exists at all, what it is and isn't, and how it is made.",
};

/** Keep "isn't" true to app/privacy and app/terms. */
const IS = [
  "A 20-question quiz about how you eat watermelon.",
  "Free to take, as often as you like, with no sign-up.",
  "A joke that takes itself just seriously enough.",
];
const IS_NOT = [
  "A psychological assessment. There is zero science here.",
  "Affiliated with the Myers-Briggs Type Indicator or its owners.",
  "A way to collect your data. Nothing saved identifies you.",
];

const PRINCIPLES: { icon: Icon; title: string; body: string }[] = [
  {
    icon: ShieldCheck,
    title: "Private by default",
    body: "No accounts, no cookies, no analytics. Answers are saved anonymously, and you can delete yours from the results page.",
  },
  {
    icon: GithubLogo,
    title: "Open source",
    body: "Every line is public on GitHub, from the twenty statements to the scoring that turns them into a type.",
  },
  {
    icon: Gift,
    title: "Free, no ads",
    body: "No paywall, no premium tier, no ads. It costs nothing to take and nothing to share.",
  },
];

const STACK: { name: string; role: string }[] = [
  { name: "Next.js", role: "The site, its pages and the small API behind the quiz." },
  { name: "Three.js", role: "The 3D watermelon on the home page, via React Three Fiber." },
  { name: "Neon Postgres", role: "Anonymous results, and the live counts built from them." },
  { name: "Vercel", role: "Hosting." },
];

export default function AboutPage() {
  return (
    <main id="main" className="relative flex min-h-dvh flex-col bg-paper text-ink">
      <SiteNav />

      <section className="relative w-full overflow-hidden border-b border-line bg-paper-2 px-5 py-28 sm:px-8 sm:py-36">
        <SeedField />
        <div className="relative mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl leading-tight font-semibold text-balance text-ink sm:text-6xl">
            Why does this exist?
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-pretty text-ink-2 sm:text-xl">
            No grand thesis. No years of research. I just really wanted to know what kind of watermelon eater
            you are. Twenty honest questions about how you actually eat watermelon - that&rsquo;s the whole idea.
          </p>
        </div>
      </section>

      {/* What it is, and isn't. */}
      <section className="w-full px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-display text-3xl font-semibold text-ink sm:text-4xl">
            What it is, and what it isn&rsquo;t
          </h2>

          <div className="mt-14 grid gap-5 md:grid-cols-2 md:gap-6">
            <div className="rounded-card bg-paper p-7 ring-1 ring-line sm:p-8">
              <h3 className="font-display text-xl font-semibold text-flesh-deep">It is</h3>
              <ul className="mt-5 space-y-4">
                {IS.map((line) => (
                  <li key={line} className="flex gap-3 leading-relaxed text-ink-2">
                    <Check size={20} weight="bold" className="mt-0.5 shrink-0 text-flesh" aria-hidden />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-card bg-paper p-7 ring-1 ring-line sm:p-8">
              <h3 className="font-display text-xl font-semibold text-ink">It isn&rsquo;t</h3>
              <ul className="mt-5 space-y-4">
                {IS_NOT.map((line) => (
                  <li key={line} className="flex gap-3 leading-relaxed text-ink-2">
                    <X size={20} weight="bold" className="mt-0.5 shrink-0 text-ink-3" aria-hidden />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it is made: white cards on the grey band. */}
      <section className="w-full border-y border-line bg-paper-2 px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">How it&rsquo;s made</h2>
            <p className="mt-4 text-lg leading-relaxed text-pretty text-ink-2">
              Three rules the site is built on.
            </p>
          </div>

          <ul className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
            {PRINCIPLES.map((item) => (
              <li
                key={item.title}
                className="relative overflow-hidden rounded-card bg-paper p-7 shadow-card ring-1 ring-line sm:p-8"
              >
                <span aria-hidden className="absolute inset-x-0 top-0 h-0.75 bg-flesh" />
                <span className="grid h-12 w-12 place-items-center rounded-control bg-blush text-flesh">
                  <item.icon size={26} aria-hidden />
                </span>
                <h3 className="mt-7 font-display text-2xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-pretty text-ink-2">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Built with. */}
      <section className="w-full px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Under the rind</h2>
            <p className="mt-4 text-lg leading-relaxed text-pretty text-ink-2">What the site is built with.</p>
          </div>

          <dl className="border-t border-line lg:col-span-7 lg:col-start-6">
            {STACK.map((item) => (
              <div key={item.name} className="grid gap-1 border-b border-line py-6 sm:grid-cols-[12rem_1fr] sm:gap-8">
                <dt className="font-display text-xl font-semibold text-ink">{item.name}</dt>
                <dd className="leading-relaxed text-ink-2 sm:pt-0.5">{item.role}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Feedback. */}
      <section className="w-full border-t border-line bg-paper-2 px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="font-display text-3xl leading-tight font-semibold text-balance text-ink sm:text-5xl">
            Found a bug, or a better question?
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-pretty text-ink-2">
            Open an issue on GitHub. Suggestions for new statements are especially welcome.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <Link
              href="/quiz"
              className="inline-flex h-14 items-center gap-4 rounded-control bg-ink py-2 pr-2 pl-6 font-display text-lg font-semibold text-paper shadow-card transition-colors duration-300 hover:bg-ink/85 focus-visible:ring-2 focus-visible:ring-flesh focus-visible:ring-offset-4 focus-visible:outline-none"
            >
              Take the quiz
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-flesh text-paper">
                <ArrowRight size={18} weight="bold" aria-hidden />
              </span>
            </Link>
            <a
              href={`${OPERATOR.github}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink underline-offset-4 hover:underline"
            >
              Open an issue
              <ArrowUpRight size={14} weight="bold" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
