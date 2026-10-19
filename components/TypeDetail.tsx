import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { Dialog } from "radix-ui";
import { ArrowLink, PrimaryLink } from "@/components/Button";
import { figureWidth } from "@/components/CharacterStage";
import TraitRadar from "@/components/TraitRadar";
import { FAMILY_INFO, type EaterType } from "@/lib/types";

/**
 * One type as a card, inside the detail dialog (the /types characters and the
 * landing chips). Drawn for the family's dark band, which the dialog paints.
 * The name and tagline are the dialog's accessible title and description.
 */
export default function TypeDetail({
  type,
  actions,
}: {
  type: EaterType;
  /** Replaces the default "Take the quiz" plus "Full page" links. */
  actions?: ReactNode;
}) {
  return (
    <article
      className="grid gap-x-12 gap-y-8 text-cine-ink md:grid-cols-2 md:grid-rows-[auto_1fr]"
      style={{ "--glow": `var(--cine-${type.family.toLowerCase()}-glow)` } as CSSProperties}
    >
      {/* Phones read top to bottom; from md the footer moves up under the tagline so the quiz link is in view. */}
      <header className="text-center md:text-left">
        <div className="relative mx-auto w-fit max-w-full md:mx-0">
          <span
            aria-hidden
            className="absolute inset-x-[8%] top-[30%] bottom-0 bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--glow)_30%,transparent),transparent)]"
          />
          {/* Shown whole at one height, as wide as its own shape. Only rendered when open, so never lazy. */}
          <Image
            src={type.image}
            alt={type.alt}
            width={type.imageWidth}
            height={type.imageHeight}
            sizes={`(min-width: 640px) ${figureWidth(type, 320)}px, ${figureWidth(type, 288)}px`}
            loading="eager"
            className="char-rim relative h-72 w-auto max-w-full object-contain sm:h-80"
          />
        </div>
        <p className="t-label mt-6 text-[color:var(--glow)]">
          {type.family} family &middot; {FAMILY_INFO[type.family].trait}
        </p>
        <Dialog.Title className="t-h1 mt-2">{type.name}</Dialog.Title>
        <Dialog.Description className="t-lead mt-3">{type.tagline}</Dialog.Description>
      </header>

      <div className="md:col-start-2 md:row-span-2 md:row-start-1">
        <p className="leading-relaxed text-pretty text-cine-ink-2 sm:text-lg">{type.description}</p>

        <h3 className="t-h3 mt-8">Signature habits</h3>
        <ul className="mt-3 space-y-2.5">
          {type.habits.map((habit) => (
            <li key={habit} className="flex gap-3 leading-snug text-cine-ink-2">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-[color:var(--glow)]" />
              {habit}
            </li>
          ))}
        </ul>

        <h3 className="t-h3 mt-8">What drives them</h3>
        <div className="mt-2">
          <TraitRadar type={type} />
        </div>
      </div>

      <footer className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6 md:col-start-1 md:row-start-2 md:self-start">
        {actions ?? (
          <>
            <PrimaryLink href="/quiz" className="w-full sm:w-auto">
              Take the quiz
            </PrimaryLink>
            <ArrowLink href={`/types/${type.slug}`} className="text-cine-ink">
              Full page
            </ArrowLink>
          </>
        )}
      </footer>
    </article>
  );
}
