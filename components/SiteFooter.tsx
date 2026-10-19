import Link from "next/link";
import { GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { Wordmark } from "@/components/SiteNav";
import { OPERATOR } from "@/lib/legal";

/** Only destinations that exist. */
const LINKS: { label: string; href: string }[] = [
  { label: "Take the quiz", href: "/quiz" },
  { label: "The 20 types", href: "/types" },
  { label: "How it works", href: "/how-it-works" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/#faq" },
];

const LINK =
  "inline-flex min-h-11 items-center text-[15px] text-ink-2 underline-offset-4 transition-colors duration-200 hover:text-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

export default function SiteFooter() {
  return (
    <footer className="w-full border-t border-line bg-paper-2">
      <div className="container-page grid gap-8 pt-14 pb-10 md:grid-cols-[1fr_auto] md:items-start">
        <div className="max-w-sm">
          <Wordmark />
          <p className="mt-2 text-[15px] leading-relaxed text-pretty text-ink-2">
            Twenty questions about how you eat watermelon. Twenty types. Zero science.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 sm:grid-cols-3 md:grid-cols-[auto_auto] md:gap-x-14">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={LINK}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={OPERATOR.github} target="_blank" rel="noopener noreferrer" className={`${LINK} gap-1.5`}>
                <GithubLogo size={16} aria-hidden />
                Source code
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Bottom padding keeps this row clear of the fixed music button. */}
      <div className="container-page flex flex-col gap-1 border-t border-line pt-4 pb-24 text-sm text-ink-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p>
          &copy; {new Date().getFullYear()} {OPERATOR.name}. For fun only, not affiliated with Myers-Briggs.
        </p>
        <nav aria-label="Legal" className="flex gap-6">
          <Link href="/privacy" className={LINK}>
            Privacy
          </Link>
          <Link href="/terms" className={LINK}>
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
