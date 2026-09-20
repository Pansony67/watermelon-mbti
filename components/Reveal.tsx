import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Seconds. Stagger siblings by passing increasing values. */
  delay?: number;
  /** Pixels the element travels up while fading in. */
  distance?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Fade-and-rise entrance for hero content, driven entirely by CSS.
 *
 * Deliberately not a Motion component: a JS-driven entrance ships the markup
 * at opacity 0 and stays that way until the main thread is free to run it,
 * which on a phone busy compiling the 3D scene can be seconds. A CSS keyframe
 * runs on the compositor regardless, and the element's resting state is
 * visible, so nothing can be left hidden if JavaScript is slow or absent.
 */
export default function Reveal({ children, delay = 0, distance = 28, className, style }: RevealProps) {
  return (
    <div
      className={`reveal${className ? ` ${className}` : ""}`}
      style={{ ...style, animationDelay: `${delay}s`, "--reveal-y": `${distance}px` } as CSSProperties}
    >
      {children}
    </div>
  );
}
