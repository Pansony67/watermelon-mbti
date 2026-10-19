import type { Metadata } from "next";
import { PrimaryLink } from "@/components/Button";
import HowSteps from "@/components/HowSteps";
import ResultPreview from "@/components/ResultPreview";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "How it works | Melonality",
  description:
    "Twenty statements, two parts: the first eight find your colour family, the last twelve your type within it. Here is exactly how Melonality sorts you.",
};

/** Mirrors lib/quiz.ts and lib/scoring.ts: update this copy if the scoring changes. */
const PARTS: { meta: string; title: string; body: string }[] = [
  {
    meta: "Questions 1 to 8",
    title: "Your family",
    body: "Everyone answers the same eight, two for each colour family. The family you agree with most is yours: Green, Blue, Yellow or Purple.",
  },
  {
    meta: "Questions 9 to 20",
    title: "Your type",
    body: "Twelve questions written for your family alone, two or three for each of its five types. The type you agree with most is yours.",
  },
  {
    meta: "All twenty",
    title: "Your traits",
    body: "Every answer also counts toward one of five traits: messiness, speed, social, planning and chaos. Your result draws them over your type's typical shape.",
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
  { title: "Answer for the real you", body: "How you actually eat watermelon, not how you would like to. Nobody is watching." },
  { title: "Go with your first instinct", body: "There is no timer. Your first reaction to a statement is usually the honest one." },
  { title: "Save Neutral for true ties", body: "The middle circle is the smallest for a reason. Lean one way whenever you can." },
];

export default function HowItWorksPage() {
  return (
    <>
      <SiteNav />
      <main id="main" className="flex-1 bg-paper text-ink">
        <section className="container-page pt-14 pb-16 sm:pt-20 lg:pb-20">
          <h1 className="t-display max-w-[14ch]">Twenty statements, one watermelon.</h1>
          <p className="t-lead mt-5 max-w-[46ch] text-ink-2">
            Exactly what happens between your first tap and your result. Spoiler: the quiz takes less time than reading this page.
          </p>
          <PrimaryLink href="/quiz" className="mt-8 w-full sm:w-auto">
            Take the quiz
          </PrimaryLink>
        </section>

        <section aria-labelledby="steps" className="border-t border-line bg-paper-2">
          <div className="container-page grid gap-10 pt-16 pb-20 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20 lg:pt-24 lg:pb-28">
            <h2 id="steps" className="t-h2">
              The short version
            </h2>
            <HowSteps />
          </div>
        </section>

        <section aria-labelledby="measures" className="border-t border-line">
          <div className="container-page grid gap-10 pt-16 pb-20 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20 lg:pt-24 lg:pb-28">
            <div>
              <h2 id="measures" className="t-h2">
                What the quiz measures
              </h2>
              <p className="t-lead mt-4 text-ink-2">Two parts: the first finds your family, the second your type within it.</p>
            </div>
            <ol className="divide-y divide-line border-y border-line">
              {PARTS.map((part) => (
                <li key={part.title} className="grid gap-2 py-7 sm:grid-cols-[10rem_1fr] sm:gap-8">
                  <p className="t-label pt-1 text-flesh-deep">{part.meta}</p>
                  <div>
                    <h3 className="t-h3">{part.title}</h3>
                    <p className="mt-2 max-w-[56ch] text-ink-2">{part.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="answer" className="border-t border-line bg-paper-2">
          <div className="container-page grid gap-12 pt-16 pb-20 lg:grid-cols-2 lg:gap-20 lg:pt-24 lg:pb-28">
            <div>
              <h2 id="answer" className="t-h2">
                How to answer
              </h2>
              <p className="t-lead mt-4 max-w-[44ch] text-ink-2">
                Every statement gets one tap on a seven-point scale, from strongly agree to strongly disagree.
              </p>
              <figure className="mt-8 rounded-panel bg-paper px-4 py-7 shadow-card sm:px-8">
                <ul className="flex items-center justify-between gap-1">
                  {SCALE.map((step) => (
                    <li key={step.label} className="grid flex-1 place-items-center">
                      <span className={`${DISC} ${step.disc}`} />
                      <span className="sr-only">{step.label}</span>
                    </li>
                  ))}
                </ul>
                <figcaption aria-hidden className="mt-4 flex justify-between font-display text-sm font-bold sm:text-base">
                  <span className="text-flesh-deep">Agree</span>
                  <span className="text-ink-3">Neutral</span>
                  <span className="text-ink">Disagree</span>
                </figcaption>
              </figure>
            </div>
            <ul className="space-y-8 lg:pt-2">
              {TIPS.map((tip) => (
                <li key={tip.title} className="border-l-2 border-flesh pl-5">
                  <h3 className="t-h3">{tip.title}</h3>
                  <p className="mt-2 max-w-[48ch] text-ink-2">{tip.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="end" className="border-t border-line">
          <div className="container-page grid items-center gap-10 pt-16 pb-20 lg:grid-cols-[1fr_minmax(0,28rem)] lg:gap-20 lg:pt-24 lg:pb-28">
            <div>
              <h2 id="end" className="t-h2">
                What you get at the end
              </h2>
              <p className="t-lead mt-4 max-w-[46ch] text-ink-2">
                Your type and its art, your family, and your five traits drawn over your type&rsquo;s typical shape. Plus how
                many other people got the same thing. No email needed to see any of it.
              </p>
              <PrimaryLink href="/quiz" className="mt-8 w-full sm:w-auto">
                Take the quiz
              </PrimaryLink>
            </div>
            <ResultPreview />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
