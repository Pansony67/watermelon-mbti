"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fades its children up when they scroll into view. Scoped to this element
 * only, and safe by construction: the markup ships visible, JavaScript hides
 * it on mount only if it is genuinely below the viewport, and the observer
 * reveals it the first time it intersects. No observer, reduced motion, or
 * already-in-view all mean "leave it visible".
 */
export default function InView({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    el.classList.add("inview-pending");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.replace("inview-pending", "inview-shown");
        observer.disconnect();
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
