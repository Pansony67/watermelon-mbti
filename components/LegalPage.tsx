import type { ReactNode } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { OPERATOR } from "@/lib/legal";

/** Shell for the policy pages: the site's header and footer, and a prose column. */
export default function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <SiteNav />
      <main id="main" className="flex-1 bg-paper text-ink">
        <article className="legal container-page max-w-3xl pt-14 pb-24 sm:pt-20">
          <h1 className="t-h1">{title}</h1>
          <p className="mt-3 text-sm text-ink-3">Last updated {OPERATOR.updated}</p>
          {children}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
