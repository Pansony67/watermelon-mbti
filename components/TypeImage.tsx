"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A type illustration that simply disappears if its file is missing, so the
 * slot shows only its ground shadow instead of a broken-image icon until
 * the art is dropped into public/images/types/.
 *
 * onError alone is not enough: an image that fails before React hydrates
 * fires its error event before the handler exists, so on mount we also check
 * whether it has already finished loading with nothing to show.
 */
export default function TypeImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const img = ref.current;
    // Reading a DOM fact that predates hydration: there is no event left to subscribe to.
    if (img?.complete && img.naturalWidth === 0) setMissing(true);
  }, []);

  if (missing) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- plain <img> by request; art arrives later as static files
    <img ref={ref} src={src} alt={alt} loading="lazy" onError={() => setMissing(true)} className="relative h-full w-full object-contain object-bottom" />
  );
}
