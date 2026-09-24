"use client";

import { useEffect, useState } from "react";
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
        className="melon-placeholder aspect-square h-[62%] rounded-full" // unslop-ignore: a melon cross-section is a circle
        style={{
          background:
            "radial-gradient(circle at 50% 42%, #FF6B85 0%, #FF4D6D 44%, #EAF7D9 45%, #EAF7D9 51%, #1C4A2B 52%, #0E2E1B 100%)",
          boxShadow: "0 24px 48px -24px rgba(29, 23, 21, 0.35)",
        }}
      />
    </div>
  );
}

const Watermelon3D = dynamic(() => import("./Watermelon3D"), {
  ssr: false,
  loading: () => <WatermelonPlaceholder />,
});

/** Let the hero copy finish its entrance before WebGL setup takes the main thread. */
const MOUNT_DELAY_MS = 900;

/**
 * Reserves a fixed 5:4 stage up front, then fills it with the 3D scene once
 * the hero has landed and the chunk has arrived. The stage mask fades the
 * rendered floor into the page so the canvas never reads as a rectangle.
 */

export default function Watermelon3DLazy() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setReady(true), MOUNT_DELAY_MS);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="stage-mask relative aspect-[5/4] w-full">
      {ready ? <Watermelon3D /> : <WatermelonPlaceholder />}
    </div>
  );
}
