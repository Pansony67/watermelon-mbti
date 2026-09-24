import type { ReactNode } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { OPERATOR } from "@/lib/legal";

/** Shell for the policy pages: same shell as the rest of the site, prose-sized column. */
export default function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main id="main" className="relative flex min-h-dvh flex-col bg-paper text-ink">
      <SiteNav />
      <article className="legal relative mx-auto w-full max-w-2xl flex-1 px-5 pt-14 pb-24 sm:px-8">
        <h1 className="font-display text-4xl font-semibold text-balance sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-ink-3">Last updated {OPERATOR.updated}</p>
        {children}
      </article>
      <SiteFooter />
    </main>
  );
}
