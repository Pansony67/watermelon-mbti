import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

/**
 * The site's one primary action, as a link. Styles live in globals.css
 * (btn-primary): tactile lift and press, arrow that moves. `className` sets
 * width or size for a context, never the colours.
 */
export function PrimaryLink({ href, children, className = "", onClick }: { href: string; children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} className={`btn-primary ${className}`}>
      {children}
      <ArrowRight size={18} weight="bold" aria-hidden className="btn-arrow" />
    </Link>
  );
}

/** A quiet text link with a moving arrow: the secondary action beside a primary one. */
export function ArrowLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`link-arrow ${className}`}>
      {children}
      <ArrowRight size={15} weight="bold" aria-hidden className="btn-arrow" />
    </Link>
  );
}
