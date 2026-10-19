"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, List, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import AccountChip from "@/components/AccountChip";
import { PrimaryLink } from "@/components/Button";
import ThemeToggle from "@/components/ThemeToggle";

/** The main pages, in menu order. Quiz sits next to Home so the test is always one tap away. */
const LINKS = [
  { label: "Home", href: "/" },
  { label: "Quiz", href: "/quiz" },
  { label: "The Types", href: "/types" },
  { label: "How it works", href: "/how-it-works" },
  { label: "About", href: "/about" },
];

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex h-11 items-center font-display text-xl font-extrabold tracking-[-0.03em] text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${className}`}
    >
      Melon<span className="text-flesh-deep">ality</span>
    </Link>
  );
}

/** Home matches only itself; every other link also lights up on its sub-pages (a type page lights Types). */
const isCurrent = (href: string, pathname: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const openButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  // Keyboard users land inside the menu when it opens and back on the trigger when it closes.
  // Not on first render: that would focus the menu button (and show its ring) on every page load.
  const toggled = useRef(false);
  useEffect(() => {
    if (!toggled.current) {
      toggled.current = true;
      return;
    }
    (open ? closeButton : openButton).current?.focus();
  }, [open]);

  // Lock page scroll and close on Escape while the menu is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    // Sticky and solid: no backdrop-filter, which would also make the header the containing block of the fixed mobile menu.
    <header className="sticky top-0 z-30 w-full border-b border-line bg-paper">
      <div className="container-page flex h-16 items-center gap-4">
        <Wordmark />

        <nav aria-label="Primary" className="ml-6 hidden items-stretch gap-7 self-stretch lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isCurrent(link.href, pathname) ? "page" : undefined}
              className="relative flex items-center text-[15px] font-medium text-ink-2 transition-colors duration-200 hover:text-ink aria-[current=page]:text-ink after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-200 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 lg:flex">
            <AccountChip />
            <ThemeToggle />
          </div>
          <PrimaryLink href="/quiz" className="btn-sm">
            Take the quiz
          </PrimaryLink>

          <button
            ref={openButton}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Open menu"
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-control text-ink ring-1 ring-line ring-inset transition-colors duration-200 hover:bg-paper-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink lg:hidden"
          >
            <List size={20} aria-hidden />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-50 flex flex-col bg-paper px-5 lg:hidden"
            initial={{ opacity: 0 }} // unslop-ignore: signals the menu opening
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
          >
            <div className="flex h-16 items-center justify-between">
              <Wordmark />
              <button
                ref={closeButton}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-11 w-11 cursor-pointer place-items-center rounded-control text-ink ring-1 ring-line ring-inset focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <X size={20} aria-hidden />
              </button>
            </div>

            <nav aria-label="Primary" className="mt-6 flex flex-col border-t border-line">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isCurrent(link.href, pathname) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="flex min-h-16 items-center justify-between border-b border-line font-display text-[1.75rem] font-bold tracking-[-0.02em] text-ink-2 aria-[current=page]:text-ink"
                >
                  {link.label}
                  <ArrowRight size={20} weight="bold" aria-hidden className="text-ink-3" />
                </Link>
              ))}
            </nav>

            <div className="mt-6 flex items-center gap-2">
              <AccountChip />
              <ThemeToggle />
            </div>

            <div className="mt-auto pb-8">
              <PrimaryLink href="/quiz" onClick={() => setOpen(false)} className="w-full">
                Take the quiz
              </PrimaryLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
