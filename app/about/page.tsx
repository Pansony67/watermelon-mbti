import type { Metadata } from "next";
import { ArrowUpRight, Check, X } from "@phosphor-icons/react/dist/ssr";
import { PrimaryLink } from "@/components/Button";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import WhyReveal from "@/components/WhyReveal";
import { OPERATOR } from "@/lib/legal";

export const metadata: Metadata = {
  title: "About | Melonality",
  description:
    "Why a watermelon personality quiz exists at all, what it is and isn't (zero science, zero data about you), and what it is built with.",
};

/** Keep "isn't" true to app/privacy and app/terms. */
const IS = [
  "A 20-question quiz about how you eat watermelon.",
  "Free to take, as often as you like. No sign-up needed.",
  "A joke that takes itself just seriously enough.",
];
const IS_NOT = [
  "A psychological assessment. There is zero science here.",
  "Affiliated with the Myers-Briggs Type Indicator or its owners.",
  "A way to collect your data. Your quiz answers never identify you.",
];

const PRINCIPLES: { title: string; body: string }[] = [
  {
    title: "Private by default",
    body: "Accounts are optional and there are no analytics or ads. Quiz answers are saved anonymously, and you can delete yours from the results page.",
  },
  {
    title: "Open source",
    body: "Every line is public on GitHub, from the twenty statements to the scoring that turns them into a type.",
  },
  {
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
    <>
      <SiteNav />
      <main id="main" className="flex-1 bg-paper text-ink">
        <WhyReveal />

        {/* What it is, and isn't: two plain lists, no boxed cards. */}
        <section aria-labelledby="is" className="border-t border-line">
          <div className="container-page pt-16 pb-20 lg:pt-24 lg:pb-28">
            <h2 id="is" className="t-h2">
              What it is, and what it isn&rsquo;t
            </h2>
            <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
              <div>
                <h3 className="t-h3 text-flesh-deep">It is</h3>
                <ul className="mt-5 divide-y divide-line border-y border-line">
                  {IS.map((line) => (
                    <li key={line} className="flex gap-3 py-4 leading-relaxed text-ink-2">
                      <Check size={20} weight="bold" className="mt-0.5 shrink-0 text-flesh-deep" aria-hidden />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="t-h3">It isn&rsquo;t</h3>
                <ul className="mt-5 divide-y divide-line border-y border-line">
                  {IS_NOT.map((line) => (
                    <li key={line} className="flex gap-3 py-4 leading-relaxed text-ink-2">
                      <X size={20} weight="bold" className="mt-0.5 shrink-0 text-ink-3" aria-hidden />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* The three rules, as a list rather than a row of icon cards. */}
        <section aria-labelledby="rules" className="border-t border-line bg-paper-2">
          <div className="container-page grid gap-10 pt-16 pb-20 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20 lg:pt-24 lg:pb-28">
            <div>
              <h2 id="rules" className="t-h2">
                Three rules it is built on
              </h2>
              <p className="t-lead mt-4 text-ink-2">So the joke never costs you anything.</p>
            </div>
            <dl className="divide-y divide-line border-y border-line">
              {PRINCIPLES.map((item) => (
                <div key={item.title} className="grid gap-2 py-7 sm:grid-cols-[12rem_1fr] sm:gap-8">
                  <dt className="t-h3">{item.title}</dt>
                  <dd className="max-w-[56ch] leading-relaxed text-ink-2">{item.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Built with. */}
        <section aria-labelledby="stack" className="border-t border-line">
          <div className="container-page grid gap-10 pt-16 pb-20 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20 lg:pt-24 lg:pb-28">
            <div>
              <h2 id="stack" className="t-h2">
                Under the rind
              </h2>
              <p className="t-lead mt-4 text-ink-2">What the site is built with.</p>
            </div>
            <dl className="divide-y divide-line border-y border-line">
              {STACK.map((item) => (
                <div key={item.name} className="grid gap-1 py-6 sm:grid-cols-[12rem_1fr] sm:gap-8">
                  <dt className="t-h3">{item.name}</dt>
                  <dd className="leading-relaxed text-ink-2 sm:pt-0.5">{item.role}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Feedback, then the quiz. */}
        <section aria-labelledby="feedback" className="border-t border-line bg-paper-2">
          <div className="container-page flex flex-col items-center pt-20 pb-24 text-center lg:pt-28 lg:pb-32">
            <h2 id="feedback" className="t-h1 max-w-[18ch]">
              Found a bug, or a better question?
            </h2>
            <p className="t-lead mt-4 max-w-[44ch] text-ink-2">
              Open an issue on GitHub. Suggestions for new statements are especially welcome.
            </p>
            <div className="mt-8 flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row sm:gap-6">
              <PrimaryLink href="/quiz" className="w-full sm:w-auto">
                Take the quiz
              </PrimaryLink>
              <a href={`${OPERATOR.github}/issues`} target="_blank" rel="noopener noreferrer" className="link-arrow text-ink">
                Open an issue
                <ArrowUpRight size={15} weight="bold" aria-hidden className="btn-arrow" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
