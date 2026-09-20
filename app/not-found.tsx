import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import { Wordmark } from "@/components/SiteNav";

export default function NotFound() {
  return (
    <main id="main" className="relative flex min-h-[100dvh] flex-col bg-rind text-cream">
      <div className="grain" aria-hidden />
      <header className="relative mx-auto flex h-[72px] w-full max-w-7xl items-center px-5 sm:px-8">
        <Wordmark />
      </header>
      <section className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 pb-16 text-center sm:px-8">
        <p className="text-[11px] font-medium tracking-[0.16em] text-pith/80 uppercase">404</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-balance sm:text-5xl">No slice here.</h1>
        <p className="mt-4 max-w-md text-cream/60">That page does not exist. The test does.</p>
        <Link
          href="/"
          className="mt-10 inline-flex h-14 items-center rounded-full bg-flesh px-8 font-display text-lg font-semibold text-rind-deep transition-transform duration-500 ease-settle hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
        >
          Back to the melon
        </Link>
      </section>
      <SiteFooter />
    </main>
  );
}
