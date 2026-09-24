import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";

export default function NotFound() {
  return (
    <main id="main" className="relative flex min-h-dvh flex-col bg-paper text-ink">
      <SiteNav />
      <section className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
        <p className="text-xs font-semibold tracking-[0.16em] text-flesh-deep uppercase">404</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-balance sm:text-5xl">No slice here.</h1>
        <p className="mt-4 max-w-md text-ink-2">That page does not exist. The test does.</p>
        <Link
          href="/"
          className="mt-10 inline-flex h-14 items-center rounded-control bg-ink px-8 font-display text-lg font-semibold text-paper transition-colors duration-300 hover:bg-ink/85"
        >
          Back to the melon
        </Link>
      </section>
      <SiteFooter />
    </main>
  );
}
