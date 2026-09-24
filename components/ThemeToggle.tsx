"use client";

import { useEffect, useLayoutEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "@phosphor-icons/react";
import { THEME_KEY, resolveTheme, type Theme } from "@/lib/theme";

const apply = (theme: Theme) => document.documentElement.setAttribute("data-theme", theme);

/** Re-renders whenever anything changes the theme attribute on <html>. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

/**
 * Light/dark switch. The inline script in the root layout sets the theme
 * before paint; this button changes and remembers it. It is mounted on every
 * page, because it also restores the theme after React's development
 * remount resets <html> (a no-op in production).
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.theme === "dark",
    () => false,
  );

  useLayoutEffect(() => apply(resolveTheme()), []);

  // With no explicit choice, keep following the system if it changes mid-visit.
  useEffect(() => {
    const query = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!localStorage.getItem(THEME_KEY)) apply(resolveTheme());
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next: Theme = dark ? "light" : "dark";
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Still switch for this visit even if it can't be remembered.
    }
    apply(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label="Dark mode"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-control text-ink-2 ring-1 ring-line ring-inset transition-colors duration-300 hover:bg-paper-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-flesh focus-visible:outline-none ${className}`}
    >
      {/* Icons switch in CSS, so the server-rendered markup is right before hydration. */}
      <Moon size={18} aria-hidden className="dark:hidden" />
      <Sun size={18} aria-hidden className="hidden dark:block" />
    </button>
  );
}
