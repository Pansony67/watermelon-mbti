"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

// Nothing to show while the chunk loads: the poster below is already there.
const Watermelon3D = dynamic(() => import("./Watermelon3D"), { ssr: false, loading: () => null });

/** Let the hero copy finish its entrance before WebGL setup takes the main thread. */
const MOUNT_DELAY_MS = 900;

/**
 * Reserves a fixed 5:4 stage up front and fills it with a poster: a still of
 * the real 3D melon at its starting angle (public/melon-poster.png). Once the
 * live scene has drawn its first frame, the two crossfade. Because they show
 * the same picture, the hand-off is invisible, and if WebGL never starts the
 * poster simply stays. The stage mask fades the edges into the page.
 *
 * Regenerate the poster whenever the melon, camera or lighting changes, or the
 * crossfade will show the difference.
 */
export default function Watermelon3DLazy() {
  const [mounted, setMounted] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), MOUNT_DELAY_MS);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="stage-mask relative aspect-[5/4] w-full">
      <Image
        src="/melon-poster.png"
        alt=""
        aria-hidden
        fill
        priority
        sizes="(min-width: 1024px) 600px, (min-width: 640px) 560px, 92vw"
        className={`object-contain transition-opacity duration-500 ease-out ${live ? "opacity-0" : "opacity-100"}`}
      />
      {mounted && (
        <div className={`absolute inset-0 transition-opacity duration-500 ease-out ${live ? "opacity-100" : "opacity-0"}`}>
          <Watermelon3D onReady={() => setLive(true)} />
        </div>
      )}
    </div>
  );
}
