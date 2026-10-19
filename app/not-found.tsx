import type { Metadata } from "next";
import { ArrowLink, PrimaryLink } from "@/components/Button";
import CharacterStage from "@/components/CharacterStage";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { TYPES } from "@/lib/types";

export const metadata: Metadata = { title: "Page not found | Melonality" };

/** The Sus-Eater, who was last seen near this page. */
const SUSPECT = TYPES.find((type) => type.slug === "sus-eater")!;

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main id="main" className="flex-1 bg-paper text-ink">
        <section className="container-page grid items-center gap-10 py-16 md:grid-cols-[1fr_minmax(0,22rem)] md:gap-16 md:py-24">
          <div className="text-center md:text-left">
            <p className="t-label text-flesh-deep">404</p>
            <h1 className="t-h1 mt-2">This page has been eaten.</h1>
            <p className="t-lead mx-auto mt-4 max-w-[38ch] text-ink-2 md:mx-0">
              Nobody saw what happened to it. The Sus-Eater says they were home all night. The quiz, at least, is right where you left it.
            </p>
            <div className="mt-8 flex flex-col items-center gap-2 sm:flex-row sm:gap-6 md:justify-start">
              <PrimaryLink href="/quiz" className="w-full sm:w-auto">
                Take the quiz
              </PrimaryLink>
              <ArrowLink href="/" className="text-ink">
                Back to the home page
              </ArrowLink>
            </div>
          </div>
          <CharacterStage type={SUSPECT} imgClass="h-64 sm:h-80" heights={[256, 320]} className="rounded-panel pt-10" />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
