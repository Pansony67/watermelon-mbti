/** The three steps, as a numbered sequence (never a row of icon boxes). Used on Home and How it works. */
const STEPS: { title: string; body: string }[] = [
  {
    title: "Answer 20 statements",
    body: "Tap how much you agree. Go with your first instinct; the melon can tell when you overthink.",
  },
  {
    title: "Find your family",
    body: "The first eight sort you into Green, Blue, Yellow or Purple. The other twelve find your exact type inside it.",
  },
  {
    title: "Send it to the group chat",
    body: "Share your result, then watch everyone insist they are actually the Saviour-Eater.",
  },
];

export default function HowSteps() {
  return (
    <ol className="divide-y divide-line border-y border-line">
      {STEPS.map((step, i) => (
        <li key={step.title} className="grid grid-cols-[3rem_1fr] gap-4 py-7 sm:grid-cols-[4.5rem_1fr] sm:gap-6">
          <span aria-hidden className="font-display text-4xl leading-none font-extrabold tracking-[-0.04em] text-flesh-deep sm:text-5xl">
            {i + 1}
          </span>
          <div>
            <h3 className="t-h3 text-ink">{step.title}</h3>
            <p className="mt-2 max-w-[52ch] text-ink-2">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
