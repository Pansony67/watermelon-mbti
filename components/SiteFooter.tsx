import Link from "next/link";
import { OPERATOR } from "@/lib/legal";

const LINK = "underline-offset-4 transition-colors duration-300 hover:text-cream hover:underline";

export default function SiteFooter() {
  return (
    <footer className="relative mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 py-6 pr-20 pl-5 text-xs text-cream/60 sm:pr-24 sm:pl-8">
      <span>&copy; {new Date().getFullYear()} {OPERATOR.name}. For entertainment only.</span>
      <nav aria-label="Legal" className="flex gap-5">
        <Link href="/privacy" className={LINK}>Privacy</Link>
        <Link href="/terms" className={LINK}>Terms</Link>
      </nav>
    </footer>
  );
}
