import Link from "next/link";
import { ArrowUp, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { OPERATOR } from "@/lib/legal";

/** Only destinations that exist. Add columns as real pages ship. */
const COLUMNS: { heading: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    heading: "The Test",
    links: [
      { label: "Take the test", href: "/quiz" },
      { label: "How it works", href: "/#how" },
      { label: "The 10 types", href: "/#types" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Why this exists", href: "/#why" },
      { label: "Source code", href: OPERATOR.github, external: true },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const ICON_BUTTON =
  "grid h-10 w-10 place-items-center rounded-control text-ink-2 ring-1 ring-line ring-inset transition-colors duration-300 hover:bg-paper-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-flesh focus-visible:outline-none";

export default function SiteFooter() {
  return (
    <footer className="relative w-full border-t border-line bg-paper">
      <div className="mx-auto w-full max-w-7xl px-5 pt-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-10">
          <div className="max-w-xs">
            <Link href="/" className="font-display text-xl font-semibold tracking-tight text-ink">
              Watermelon<span className="text-flesh">MBTI</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-ink-2">
              Twenty questions about how you eat watermelon. Ten types. Zero science.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="border-b border-line pb-3 font-display text-base font-semibold text-ink">
                {column.heading}
              </h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[15px] text-ink-2 transition-colors duration-300 hover:text-ink"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-[15px] text-ink-2 transition-colors duration-300 hover:text-ink">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom padding keeps this row clear of the fixed music player. */}
        <div className="mt-14 flex flex-col gap-6 border-t border-line pt-8 pb-24 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink">
              <Link href="/terms" className="hover:underline hover:underline-offset-4">Terms of Service</Link>
              <Link href="/privacy" className="hover:underline hover:underline-offset-4">Privacy Policy</Link>
            </nav>
            <p className="mt-2 text-sm text-ink-3">
              &copy; {new Date().getFullYear()} {OPERATOR.name}. For entertainment only.
            </p>
          </div>

          <div className="flex gap-2.5">
            <a href={OPERATOR.github} target="_blank" rel="noopener noreferrer" aria-label="Source code on GitHub" className={ICON_BUTTON}>
              <GithubLogo size={18} aria-hidden />
            </a>
            <a href="#main" aria-label="Back to top" className={ICON_BUTTON}>
              <ArrowUp size={18} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
