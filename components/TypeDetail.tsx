import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Dialog } from "radix-ui";
import TraitRadar from "@/components/TraitRadar";
import type { EaterType } from "@/lib/types";

/**
 * One type in full, for the dialog on /types and the type's own page. Drawn
 * for the family's dark band, which the parent paints. In the dialog, the name
 * and tagline are the dialog's accessible title and description, and a link
 * leads to the full page.
 */
export default function TypeDetail({ type, dialog = false }: { type: EaterType; dialog?: boolean }) {
  const Title = dialog ? Dialog.Title : "h1";
  const Description = dialog ? Dialog.Description : "p";
  const Heading = dialog ? "h3" : "h2";

  return (
    <article
      className="grid gap-x-12 gap-y-10 text-cine-ink md:grid-cols-2 md:grid-rows-[auto_1fr]"
      style={{ "--glow": `var(--cine-${type.family.toLowerCase()}-glow)` } as CSSProperties}
    >
      {/* Phones read top to bottom; from md the footer moves up under the tagline so the quiz link is in view. */}
      <header className="text-center md:text-left">
        <div className="relative mx-auto max-w-[300px] md:mx-0">
          {/* Floor light, as on /types: the characters are dark photographs. */}
          <span
            aria-hidden
            className="absolute inset-x-[8%] top-[30%] bottom-0 bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--glow)_30%,transparent),transparent)]"
          />
          {/* Shown whole at no more than native size: no crop, no mask. Only rendered when on screen, so never lazy. */}
          <Image
            src={type.image}
            alt=""
            width={301}
            height={250}
            sizes="300px"
            loading="eager"
            className="relative h-auto w-full object-contain"
          />
        </div>
        <Title className="mt-6 font-display text-4xl leading-tight font-semibold text-balance sm:text-5xl">{type.name}</Title>
        <p className="mt-2 text-sm font-semibold tracking-[0.14em] text-[color:var(--glow)] uppercase">{type.family} family</p>
        <Description className="mt-4 text-xl leading-snug text-balance">{type.tagline}</Description>
      </header>

      <div className="md:col-start-2 md:row-span-2 md:row-start-1">
        <p className="text-lg leading-relaxed text-pretty text-cine-ink-2">{type.description}</p>

        <Heading className="mt-8 font-display text-xl font-semibold">Signature habits</Heading>
        <ul className="mt-3 space-y-2.5">
          {type.habits.map((habit) => (
            <li key={habit} className="flex gap-3 leading-snug text-cine-ink-2">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-[color:var(--glow)]" />
              {habit}
            </li>
          ))}
        </ul>

        <Heading className="mt-8 font-display text-xl font-semibold">What drives them</Heading>
        <div className="mt-2">
          <TraitRadar type={type} />
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:col-start-1 md:row-start-2 md:self-start md:justify-start">
        <Link
          href="/quiz"
          className="inline-flex h-14 items-center gap-3 rounded-control bg-flesh px-6 font-display text-lg font-semibold text-cine-base transition-colors duration-300 hover:bg-flesh/85 focus-visible:ring-2 focus-visible:ring-cine-ink focus-visible:ring-offset-4 focus-visible:ring-offset-cine-base focus-visible:outline-none"
        >
          Take the quiz
          <ArrowRight size={18} weight="bold" aria-hidden />
        </Link>
        {dialog && (
          <Link
            href={`/types/${type.slug}`}
            className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline"
          >
            Full page
            <ArrowRight size={14} weight="bold" aria-hidden />
          </Link>
        )}
      </footer>
    </article>
  );
}
