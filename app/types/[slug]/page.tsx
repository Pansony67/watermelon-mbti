import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { PrimaryLink } from "@/components/Button";
import { figureWidth } from "@/components/CharacterStage";
import ShareButtons from "@/components/ShareButtons";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import TraitBars from "@/components/TraitBars";
import TraitRadar from "@/components/TraitRadar";
import { FAMILY_INFO, FAMILY_STYLE, TRAIT_LABEL, TYPES, topTrait } from "@/lib/types";

const find = (slug: string) => TYPES.find((type) => type.slug === slug);

export function generateStaticParams() {
  return TYPES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/types/[slug]">): Promise<Metadata> {
  const type = find((await params).slug);
  if (!type) notFound();
  const title = `${type.name}: ${type.tagline}`;
  const description = `${type.name} is one of 20 Melonality types, in the ${type.family} family. ${type.tagline} Take the quiz to find yours.`;
  // The preview image comes from this route's opengraph-image; openGraph is set in full because a page's replaces the layout's.
  return {
    title: `${type.name} | Melonality`,
    description,
    alternates: { canonical: `/types/${type.slug}` },
    openGraph: { title, description, url: `/types/${type.slug}`, siteName: "Melonality", type: "profile" },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** One type's own page: what a shared result link lands on. */
export default async function TypePage({ params }: PageProps<"/types/[slug]">) {
  const type = find((await params).slug);
  if (!type) notFound();
  const top = topTrait(type.traits);
  const family = TYPES.filter((t) => t.family === type.family && t.slug !== type.slug);

  return (
    <>
      <SiteNav />
      <main
        id="main"
        className={`flex-1 text-cine-ink ${FAMILY_STYLE[type.family].band}`}
        style={{ "--glow": `var(--cine-${type.family.toLowerCase()}-glow)` } as CSSProperties}
      >
        {/* Hero: name, character and the one action, in the first phone screen. */}
        <section aria-labelledby="type-name" className="relative isolate overflow-hidden">
          <span
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_50%_45%,color-mix(in_srgb,var(--glow)_22%,transparent),transparent_72%)] md:bg-[radial-gradient(45%_70%_at_74%_55%,color-mix(in_srgb,var(--glow)_22%,transparent),transparent_72%)]"
          />
          <div className="container-page pt-4 md:pt-6">
            <Link
              href={`/types#family-${type.family}`}
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cine-ink-2 transition-colors hover:text-cine-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cine-ink"
            >
              <ArrowLeft size={16} weight="bold" aria-hidden />
              All 20 types
            </Link>
          </div>
          <div className="container-page grid grid-cols-1 items-center gap-x-12 pt-2 pb-12 [grid-template-areas:'head''art''body'] md:grid-cols-2 md:pt-6 md:pb-20 md:[grid-template-areas:'head_art''body_art']">
            <div className="text-center [grid-area:head] md:self-end md:text-left">
              <p className="t-label text-[color:var(--glow)]">
                {type.family} family &middot; {FAMILY_INFO[type.family].trait}
              </p>
              <h1 id="type-name" className="t-h1 mt-2 lg:t-display">
                {type.name}
              </h1>
            </div>
            <div className="mt-4 flex justify-center [grid-area:art] md:mt-0">
              <Image
                src={type.image}
                alt={type.alt}
                width={type.imageWidth}
                height={type.imageHeight}
                loading="eager"
                fetchPriority="high"
                sizes={`(min-width: 768px) ${figureWidth(type, 448)}px, ${figureWidth(type, 288)}px`}
                className="char-rim h-72 w-auto max-w-full object-contain sm:h-96 md:h-[28rem]"
              />
            </div>
            <div className="mt-5 text-center [grid-area:body] md:mt-6 md:self-start md:text-left">
              <p className="t-lead mx-auto max-w-[34ch] md:mx-0">{type.tagline}</p>
              <p className="mt-3 text-sm text-cine-ink-2">
                Strongest trait:{" "}
                <span className="font-semibold text-cine-ink">
                  {TRAIT_LABEL[top]} ({type.traits[top]})
                </span>
              </p>
              <div className="mt-7 flex flex-col items-center gap-1 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 md:justify-start">
                <PrimaryLink href="/quiz" className="w-full sm:w-auto">
                  Take the quiz
                </PrimaryLink>
                <ShareButtons slug={type.slug} name={type.name} mine={false} quiet />
              </div>
            </div>
          </div>
        </section>

        {/* The story and the habits. */}
        <section aria-labelledby="story" className="border-t border-cine-ink/10">
          <div className="container-page grid gap-10 pt-14 pb-16 md:grid-cols-[1.4fr_1fr] md:gap-16 md:pt-20 md:pb-20">
            <div>
              <h2 id="story" className="t-h2">
                How the {type.name} eats
              </h2>
              <p className="t-lead mt-4 max-w-[60ch] text-cine-ink-2">{type.description}</p>
            </div>
            <div>
              <h2 className="t-h3">Signature habits</h2>
              <ul className="mt-4 space-y-3">
                {type.habits.map((habit) => (
                  <li key={habit} className="flex gap-3 leading-snug text-cine-ink-2">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-[color:var(--glow)]" />
                    {habit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* The typical profile, as a shape and as numbers. */}
        <section aria-labelledby="profile" className="border-t border-cine-ink/10">
          <div className="container-page grid items-center gap-10 pt-14 pb-16 md:grid-cols-2 md:gap-16 md:pt-20 md:pb-20">
            <div>
              <h2 id="profile" className="t-h2">
                The typical {type.name}
              </h2>
              <p className="mt-3 max-w-[44ch] text-cine-ink-2">
                Five traits, scored 0 to 100. Your own result draws your answers over this shape.
              </p>
              <div className="mt-8">
                <TraitBars traits={type.traits} />
              </div>
            </div>
            <TraitRadar type={type} />
          </div>
        </section>

        {/* The rest of the family. */}
        <section aria-labelledby="family" className="border-t border-cine-ink/10">
          <div className="container-page pt-14 pb-20 md:pt-20 md:pb-24">
            <h2 id="family" className="t-h2">
              The rest of the {type.family} family
            </h2>
            <p className="mt-3 text-cine-ink-2">{FAMILY_INFO[type.family].line}</p>
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {family.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/types/${other.slug}`}
                    className="group flex h-full flex-col items-center rounded-card bg-cine-ink/5 px-3 pt-5 pb-4 text-center transition-colors duration-200 hover:bg-cine-ink/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cine-ink"
                  >
                    <Image
                      src={other.image}
                      alt=""
                      width={other.imageWidth}
                      height={other.imageHeight}
                      sizes={`${figureWidth(other, 160)}px`}
                      className="char-rim h-32 w-auto max-w-full object-contain transition-transform duration-300 ease-settle group-hover:-translate-y-1 sm:h-40"
                    />
                    <span className="mt-3 font-display font-bold tracking-[-0.01em]">{other.name}</span>
                    <span className="mt-0.5 text-xs leading-snug text-cine-ink-2">{other.tagline}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
