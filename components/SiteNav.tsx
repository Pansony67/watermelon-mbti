"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, List, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import ThemeToggle from "@/components/ThemeToggle";

/** Every link lands on a real section of the landing page. */
const LINKS = [
  { label: "Home", href: "/" },
  { label: "The Types", href: "/#types" },
  { label: "How it works", href: "/#how" },
  { label: "About", href: "/#why" },
];

export function Wordmark() {
  return (
    <Link href="/" className="font-display text-lg font-semibold tracking-tight text-ink">
      Watermelon<span className="text-flesh">MBTI</span>
    </Link>
  );
}

export function TakeTheTest({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/quiz"
      className={`group h-10 items-center gap-2 rounded-control bg-ink px-4 text-sm font-semibold text-paper transition-colors duration-300 hover:bg-ink/85 focus-visible:ring-2 focus-visible:ring-flesh focus-visible:ring-offset-2 focus-visible:outline-none ${className}`}
    >
      Take the Test
      <ArrowRight size={15} weight="bold" aria-hidden className="text-flesh" />
    </Link>
  );
}

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const openButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  // Keyboard users land inside the menu when it opens and back on the trigger when it closes.
  useEffect(() => {
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
    // No backdrop-filter here: it would make the header the containing block of the fixed mobile menu.
    <header className="relative z-20 w-full border-b border-line bg-paper">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <Wordmark />

        <nav aria-label="Primary" className="absolute left-1/2 hidden h-16 -translate-x-1/2 items-stretch gap-8 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={link.href === pathname ? "page" : undefined}
              className="relative flex items-center text-[15px] font-medium text-ink-2 transition-colors duration-300 hover:text-ink aria-[current=page]:text-ink before:absolute before:inset-x-0 before:top-0 before:h-0.75 before:bg-flesh before:opacity-0 before:transition-opacity before:duration-300 aria-[current=page]:before:opacity-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <TakeTheTest className="hidden lg:inline-flex" />

          <button
            ref={openButton}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Open menu"
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-control text-ink ring-1 ring-line ring-inset transition-colors duration-300 hover:bg-paper-2 focus-visible:ring-2 focus-visible:ring-flesh focus-visible:outline-none lg:hidden"
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
                className="grid h-10 w-10 cursor-pointer place-items-center rounded-control text-ink ring-1 ring-line ring-inset focus-visible:ring-2 focus-visible:ring-flesh focus-visible:outline-none"
              >
                <X size={20} aria-hidden />
              </button>
            </div>

            <nav aria-label="Primary" className="mt-8 flex flex-col divide-y divide-line border-y border-line">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={link.href === pathname ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="block py-4 font-display text-3xl font-semibold text-ink-2 aria-[current=page]:text-ink"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pb-10">
              <TakeTheTest className="inline-flex h-12 w-full justify-center text-base" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
