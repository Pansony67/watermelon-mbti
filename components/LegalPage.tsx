import type { ReactNode } from "react";
import SiteFooter from "@/components/SiteFooter";
import { Wordmark } from "@/components/SiteNav";
import { OPERATOR } from "@/lib/legal";

/** Shell for the policy pages: same shell as the rest of the site, prose-sized column. */
export default function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main id="main" className="relative flex min-h-[100dvh] flex-col bg-rind text-cream">
      <div className="grain" aria-hidden />
      <header className="relative mx-auto flex h-[72px] w-full max-w-7xl items-center px-5 sm:px-8">
        <Wordmark />
      </header>
      <article className="legal relative mx-auto w-full max-w-2xl flex-1 px-5 pt-6 pb-20 sm:px-8">
        <h1 className="font-display text-4xl font-semibold text-balance sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-cream/60">Last updated {OPERATOR.updated}</p>
        {children}
      </article>
      <SiteFooter />
    </main>
  );
}
