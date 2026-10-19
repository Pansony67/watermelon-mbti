"use client";

import { useEffect, useMemo, useState, useSyncExternalStore, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { PrimaryLink } from "@/components/Button";
import { figureWidth } from "@/components/CharacterStage";
import ShareButtons from "@/components/ShareButtons";
import SiteFooter from "@/components/SiteFooter";
import { Wordmark } from "@/components/SiteNav";
import ThemeToggle from "@/components/ThemeToggle";
import TraitRadar from "@/components/TraitRadar";
import { ANSWERS_STORAGE_KEY, PROGRESS_STORAGE_KEY } from "@/lib/quiz";
import { parseAnswers, scoreQuiz } from "@/lib/scoring";
import { SITE_URL } from "@/lib/site";
import { FAMILIES, FAMILY_INFO, FAMILY_STYLE, TRAIT_LABEL, topTrait, type Family } from "@/lib/types";

/** Remembers which answer set was already written, so a refresh doesn't insert twice. */
const SUBMITTED_KEY = "watermelon-mbti:submitted";
/** The saved row's deletion token, kept only in this tab. */
const TOKEN_KEY = "watermelon-mbti:delete-token";
/** Below this many saved results the share of players is too noisy to show. */
const MIN_PLAYERS_FOR_SHARE = 30;

const noop = () => () => {};

export default function ResultsPage() {
  // Server render has no sessionStorage; the client snapshot takes over on hydration.
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const raw = useSyncExternalStore(noop, () => sessionStorage.getItem(ANSWERS_STORAGE_KEY), () => null);

  const answers = useMemo(() => {
    if (!raw) return null;
    try {
      return parseAnswers(JSON.parse(raw));
    } catch {
      return null;
    }
  }, [raw]);

  // Scored here too, with the same functions the server uses, so the result shows without a database.
  const result = useMemo(() => (answers ? scoreQuiz(answers) : null), [answers]);
  const [share, setShare] = useState<number | null>(null);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (!raw || !result) return;
    let cancelled = false;

    const submit =
      sessionStorage.getItem(SUBMITTED_KEY) === raw
        ? Promise.resolve()
        : fetch("/api/quiz/submit", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ answers }),
          })
            .then(async (r) => {
              // No database here (local development), or saving paused for this address: the result still shows.
              if (r.status === 503 || r.status === 429) return;
              if (!r.ok) throw new Error(`submit ${r.status}`);
              const { deleteToken } = (await r.json()) as { deleteToken: string };
              sessionStorage.setItem(SUBMITTED_KEY, raw);
              sessionStorage.setItem(TOKEN_KEY, deleteToken);
            })
            .catch((error) => console.error("result not saved", error));

    // Fetch the breakdown after the write so it counts this player too.
    submit
      .then(() => fetch("/api/stats/breakdown"))
      // No stats without a database (503 locally); the line just stays hidden.
      .then((r) => (r.ok ? (r.json() as Promise<{ total: number; shares: Record<string, number> }>) : null))
      .then((data) => {
        if (!cancelled && data && data.total >= MIN_PLAYERS_FOR_SHARE) setShare(data.shares[result.type.slug] ?? 0);
      })
      .catch((error) => console.error("breakdown unavailable", error));

    return () => {
      cancelled = true;
    };
  }, [raw, answers, result]);

  const remove = async () => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) return;
    const r = await fetch("/api/quiz/response", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (r.ok || r.status === 404) {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(SUBMITTED_KEY);
      setDeleted(true);
    }
  };

  const retake = () => {
    sessionStorage.removeItem(ANSWERS_STORAGE_KEY);
    sessionStorage.removeItem(PROGRESS_STORAGE_KEY);
  };

  const type = result?.type;
  const glow = type ? ({ "--glow": `var(--cine-${type.family.toLowerCase()}-glow)` } as CSSProperties) : undefined;
  const top = result ? topTrait(result.traits) : null;

  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <header className="border-b border-line bg-paper">
        <div className="container-page flex h-16 items-center justify-between">
          <Wordmark />
          <ThemeToggle />
        </div>
      </header>

      {!hydrated ? (
        <div className="flex-1" />
      ) : result && type && top ? (
        <main id="main" className={`flex-1 text-cine-ink ${FAMILY_STYLE[type.family].band}`} style={glow}>
          {/* The card: everything worth a screenshot fits one phone screen, with the site's name on it. */}
          <section aria-labelledby="result-name" className="relative isolate overflow-hidden">
            <span
              aria-hidden
              className="absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_50%_42%,color-mix(in_srgb,var(--glow)_22%,transparent),transparent_72%)] md:bg-[radial-gradient(45%_70%_at_74%_55%,color-mix(in_srgb,var(--glow)_22%,transparent),transparent_72%)]"
            />
            <div className="container-page grid grid-cols-1 items-center gap-x-12 pt-8 pb-10 [grid-template-areas:'head''art''body'] md:grid-cols-2 md:pt-16 md:pb-16 md:[grid-template-areas:'head_art''body_art']">
              <div className="text-center [grid-area:head] md:self-end md:text-left">
                <p className="t-label text-cine-ink-2">Your result</p>
                <h1 id="result-name" className="t-h1 lg:t-display mt-2">
                  <span className="block text-[0.5em] leading-tight font-semibold tracking-[-0.01em] text-cine-ink-2">You&rsquo;re the</span>
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
                <p className="t-label text-[color:var(--glow)]">
                  {type.family} family &middot; {FAMILY_INFO[type.family].trait}
                </p>
                <p className="t-lead mx-auto mt-3 max-w-[34ch] text-cine-ink md:mx-0">{type.tagline}</p>
                <p className="mt-3 text-sm text-cine-ink-2">
                  Your strongest trait:{" "}
                  <span className="font-semibold text-cine-ink">
                    {TRAIT_LABEL[top]} ({result.traits[top]})
                  </span>
                </p>
                <div className="mt-7">
                  <ShareButtons slug={type.slug} name={type.name} />
                </div>
                <p className="mt-6 text-xs text-cine-ink-2">Find yours at {SITE_URL.replace("https://", "")}</p>
              </div>
            </div>
          </section>

          {/* Why: the player's own scores over the type's typical shape, and how the families compared. */}
          <section aria-labelledby="why" className="border-t border-cine-ink/10">
            <div className="container-page grid gap-10 pt-14 pb-16 md:grid-cols-2 md:gap-16 md:pt-20 md:pb-20">
              <div>
                <h2 id="why" className="t-h2">
                  Why you got this
                </h2>
                <p className="mt-3 max-w-[44ch] text-cine-ink-2">
                  Every answer counts toward one of five traits. Yours are the solid shape; the dashed one is a typical{" "}
                  {type.name}.
                </p>
                <div className="mt-6">
                  <TraitRadar type={type} you={result.traits} />
                </div>
              </div>
              <div className="md:pt-2">
                <h2 className="t-h3">Family match</h2>
                <p className="mt-2 text-sm text-cine-ink-2">How strongly your first eight answers matched each family.</p>
                <FamilyBars scores={result.familyScores} winner={result.family} />
                {share !== null && (
                  <p className="mt-8 text-cine-ink-2">
                    <span className="font-display text-3xl font-extrabold tracking-[-0.02em] text-cine-ink">{share}%</span> of players
                    got the {type.name}.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* The type itself. */}
          <section aria-labelledby="about-type" className="border-t border-cine-ink/10">
            <div className="container-page grid gap-10 pt-14 pb-16 md:grid-cols-[1.4fr_1fr] md:gap-16 md:pt-20 md:pb-20">
              <div>
                <h2 id="about-type" className="t-h2">
                  About the {type.name}
                </h2>
                <p className="t-lead mt-4 max-w-[60ch] text-cine-ink-2">{type.description}</p>
              </div>
              <div>
                <h3 className="t-h3">Signature habits</h3>
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

          {/* What next. */}
          <section aria-labelledby="next" className="border-t border-cine-ink/10">
            <div className="container-page flex flex-col items-center pt-14 pb-12 text-center md:pt-20">
              <h2 id="next" className="t-h2 max-w-[20ch]">
                Now make your friends take it.
              </h2>
              <p className="mt-3 text-cine-ink-2">Then compare. Someone in the group chat is definitely a Sus-Eater.</p>
              <div className="mt-7">
                <ShareButtons slug={type.slug} name={type.name} />
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-x-8">
                <Link href="/quiz" onClick={retake} className="link-arrow text-cine-ink">
                  Take it again
                  <ArrowRight size={15} weight="bold" aria-hidden className="btn-arrow" />
                </Link>
                <Link href={`/types?type=${type.slug}`} className="link-arrow text-cine-ink">
                  See all 20 types
                  <ArrowRight size={15} weight="bold" aria-hidden className="btn-arrow" />
                </Link>
              </div>

              <p className="mt-12 max-w-[60ch] text-xs leading-relaxed text-cine-ink-2">
                {deleted ? (
                  "Your saved result has been deleted."
                ) : (
                  <>
                    Your answers are stored anonymously to power the stats.{" "}
                    <button type="button" onClick={remove} className="-my-3 cursor-pointer py-3 underline underline-offset-4 hover:text-cine-ink">
                      Delete my response
                    </button>{" "}
                    &middot;{" "}
                    <Link href="/privacy" className="underline underline-offset-4 hover:text-cine-ink">
                      Privacy
                    </Link>
                  </>
                )}
              </p>
            </div>
          </section>
        </main>
      ) : (
        <main id="main" className="container-page flex flex-1 flex-col items-center justify-center py-20 text-center">
          <h1 className="t-h1 text-ink">No result yet.</h1>
          <p className="t-lead mt-4 max-w-[40ch] text-ink-2">
            Your answers stay in this browser tab only. Take the quiz and your result shows up here.
          </p>
          <PrimaryLink href="/quiz" className="mt-8 w-full sm:w-auto">
            Take the quiz
          </PrimaryLink>
        </main>
      )}

      <SiteFooter />
    </div>
  );
}

/** How strongly the shared questions matched each family, 0-100. The winner is lit in its family colour. */
function FamilyBars({ scores, winner }: { scores: Record<Family, number>; winner: Family }) {
  return (
    <ul className="mt-4 space-y-3">
      {FAMILIES.map((family) => {
        const won = family === winner;
        return (
          <li key={family}>
            <div className="flex justify-between text-sm">
              <span className={won ? "font-semibold text-cine-ink" : "text-cine-ink-2"}>{family}</span>
              <span className={`tabular-nums ${won ? "font-semibold text-cine-ink" : "text-cine-ink-2"}`}>{scores[family]}%</span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full bg-cine-ink/10">
              <div
                className={`h-full rounded-full ${won ? "bg-[color:var(--glow)]" : "bg-cine-ink/35"}`}
                style={{ width: `${scores[family]}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
