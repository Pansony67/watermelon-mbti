"use client";

import dynamic from "next/dynamic";

/**
 * Static stand-in shown while the WebGL bundle downloads, and as the fallback
 * if WebGL is unavailable. Same palette and same box as the real thing, so
 * swapping it out costs no layout shift.
 */
export function WatermelonPlaceholder() {
  return (
    <div className="absolute inset-0 grid place-items-center" aria-hidden>
      <div
        className="melon-placeholder aspect-square h-[62%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, #FF6B85 0%, #FF4D6D 44%, #EAF7D9 45%, #EAF7D9 51%, #1C4A2B 52%, #0E2E1B 100%)",
          boxShadow: "0 24px 60px -18px rgba(4, 22, 13, 0.85)",
        }}
      />
    </div>
  );
}

const Watermelon3D = dynamic(() => import("./Watermelon3D"), {
  ssr: false,
  loading: () => <WatermelonPlaceholder />,
});

/**
 * Reserves a fixed 5:4 stage up front, then fills it with the 3D scene once
 * the chunk arrives. The stage mask fades the rendered floor into the page
 * so the canvas never reads as a rectangle.
 */
export default function Watermelon3DLazy() {
  return (
    <div className="stage-mask relative aspect-[5/4] w-full">
      <Watermelon3D />
    </div>
  );
}
