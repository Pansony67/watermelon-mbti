"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, List, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// About, The Types, Insights return here once their pages exist.
const LINKS = [{ label: "Home", href: "/", current: true }];

const EASE = [0.16, 1, 0.3, 1] as const;

export function Wordmark() {
  return (
    <Link href="/" className="font-display text-lg font-semibold tracking-tight">
      Watermelon<span className="text-flesh">MBTI</span>
    </Link>
  );
}

function TakeTheTest({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/quiz"
      className={`group h-11 items-center gap-2.5 rounded-full px-5 text-sm font-medium text-cream ring-1 ring-cream/20 transition-[transform,box-shadow,background-color] duration-500 ease-settle ring-inset hover:-translate-y-px hover:bg-cream/[0.05] focus-visible:ring-2 focus-visible:ring-cream focus-visible:outline-none active:translate-y-0 ${className}`}
    >
      Take the Test
      <ArrowRight
        size={15}
        weight="bold"
        aria-hidden
        className="transition-transform duration-500 ease-settle group-hover:translate-x-0.5"
      />
    </Link>
  );
}

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
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
    <header className="relative z-20 mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-5 sm:px-8">
      <Wordmark />

      <nav
        aria-label="Primary"
        className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 lg:flex"
      >
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={link.current ? "page" : undefined}
            className="relative py-2 text-[15px] text-cream/65 transition-colors duration-300 hover:text-cream aria-[current=page]:text-cream after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-flesh after:transition-transform after:duration-500 after:ease-settle hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <TakeTheTest className="hidden lg:inline-flex" />

      <button
        ref={openButton}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label="Open menu"
        className="grid h-11 w-11 cursor-pointer place-items-center rounded-full text-cream ring-1 ring-cream/20 ring-inset transition-colors duration-300 hover:bg-cream/[0.05] focus-visible:ring-2 focus-visible:ring-cream focus-visible:outline-none lg:hidden"
      >
        <List size={20} aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-50 flex flex-col bg-rind/90 px-5 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
          >
            <div className="flex h-[72px] items-center justify-between">
              <Wordmark />
              <button
                ref={closeButton}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-11 w-11 cursor-pointer place-items-center rounded-full text-cream ring-1 ring-cream/20 ring-inset focus-visible:ring-2 focus-visible:ring-cream focus-visible:outline-none"
              >
                <X size={20} aria-hidden />
              </button>
            </div>

            <nav aria-label="Primary" className="mt-10 flex flex-col gap-2">
              {LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.08 + i * 0.06, ease: EASE }}
                >
                  <Link
                    href={link.href}
                    aria-current={link.current ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-display text-4xl font-semibold text-cream/70 aria-[current=page]:text-cream"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              className="mt-auto pb-10"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.36, ease: EASE }}
            >
              <TakeTheTest className="inline-flex w-full justify-center" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
