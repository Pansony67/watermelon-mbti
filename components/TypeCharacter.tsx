"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useSyncExternalStore } from "react";
import { X } from "@phosphor-icons/react";
import { Dialog, HoverCard } from "radix-ui";
import TypeDetail from "@/components/TypeDetail";
import { FAMILY_STYLE, type EaterType } from "@/lib/types";

const noop = () => () => {};

/** Devices with a real hovering pointer. Touch screens never get the preview card. */
const FINE_HOVER = "(hover: hover) and (pointer: fine)";
const watchHover = (onChange: () => void) => {
  const query = matchMedia(FINE_HOVER);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

/**
 * One character on /types. A button opens the type's detail dialog; where a
 * pointer can hover, hovering or focusing it first shows a small preview card.
 * The open dialog is mirrored in the URL as /types?type={slug}, and loading
 * that URL opens it, so a type can be shared.
 */
export default function TypeCharacter({ type, eager }: { type: EaterType; eager: boolean }) {
  const router = useRouter();
  const canHover = useSyncExternalStore(watchHover, () => matchMedia(FINE_HOVER).matches, () => false);
  const linked = useSyncExternalStore(noop, () => new URLSearchParams(location.search).get("type") === type.slug, () => false);
  // Null until the visitor opens or closes the dialog; until then the URL decides.
  const [chosen, setChosen] = useState<boolean | null>(null);
  const [previewing, setPreviewing] = useState(false);
  // Focus returns to the character when the dialog closes; that shouldn't pop the preview back up.
  const returning = useRef(false);
  const open = chosen ?? linked;

  const setOpen = (next: boolean) => {
    setChosen(next);
    if (!next) returning.current = true;
    router.replace(next ? `/types?type=${type.slug}` : "/types", { scroll: false });
  };

  const setPreview = (next: boolean) => {
    if (next && returning.current) {
      returning.current = false;
      return;
    }
    setPreviewing(next);
  };

  const glow = { "--glow": `var(--cine-${type.family.toLowerCase()}-glow)` } as CSSProperties;

  // Every figure is drawn at one height (h-40 / sm:h-52 / lg:h-64 below), as wide as its own shape.
  // The PNGs end at the feet, so equal heights put every figure in a row on the same baseline.
  const width = (height: number) => Math.round((height * type.imageWidth) / type.imageHeight);

  // Spans, not divs: a button may only hold phrasing content.
  const trigger = (
    <Dialog.Trigger asChild>
      <button
        type="button"
        aria-label={type.name}
        className="group flex cursor-pointer flex-col items-center rounded-card text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--glow)]"
      >
        <span className="relative block transition-transform duration-500 ease-settle group-hover:-translate-y-2 group-focus-visible:-translate-y-2">
          {/* Each character's own floor light, brighter on hover. */}
          <span
            aria-hidden
            className="absolute inset-x-[8%] top-[30%] bottom-0 bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--glow)_30%,transparent),transparent)] opacity-60 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
          />
          <Image
            src={type.image}
            alt=""
            width={type.imageWidth}
            height={type.imageHeight}
            sizes={`(min-width: 1024px) ${width(256)}px, (min-width: 640px) ${width(208)}px, ${width(160)}px`}
            // The first band is on screen at load; on phones its first character is the LCP.
            loading={eager ? "eager" : "lazy"}
            // Shown whole: no mask or crop. The real width/height keep the box at the PNG's own shape,
            // and 256px tall stays well under every file's native height.
            className="relative h-40 w-auto object-contain sm:h-52 lg:h-64"
          />
        </span>
        <span className="mt-3 block text-base font-semibold tracking-[-0.01em] whitespace-nowrap text-[color:var(--glow)] sm:text-lg">
          {type.name}
        </span>
      </button>
    </Dialog.Trigger>
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {canHover ? (
        <HoverCard.Root open={previewing && !open} onOpenChange={setPreview} openDelay={300} closeDelay={100}>
          <HoverCard.Trigger asChild>{trigger}</HoverCard.Trigger>
          <HoverCard.Portal>
            <HoverCard.Content
              side="top"
              sideOffset={8}
              collisionPadding={16}
              style={glow}
              className="pop-panel z-40 w-64 rounded-card bg-cine-base p-4 text-left shadow-panel ring-1 ring-cine-ink/10"
            >
              <p className="text-xs font-semibold tracking-[0.14em] text-[color:var(--glow)] uppercase">{type.family} family</p>
              <p className="mt-1 font-display text-lg leading-snug font-semibold text-cine-ink">{type.name}</p>
              <p className="mt-1 text-sm leading-snug text-cine-ink-2">{type.tagline}</p>
            </HoverCard.Content>
          </HoverCard.Portal>
        </HoverCard.Root>
      ) : (
        trigger
      )}

      <Dialog.Portal>
        <Dialog.Overlay className="pop-fade fixed inset-0 z-50 bg-black/70" />
        {/* Near full screen on phones, a centred panel from sm up; the inside scrolls, the close button stays put. */}
        <Dialog.Content
          className={`pop-panel fixed inset-2 z-50 flex flex-col overflow-hidden rounded-card shadow-panel sm:inset-auto sm:top-1/2 sm:left-1/2 sm:max-h-[min(90dvh,60rem)] sm:w-[min(60rem,calc(100vw-3rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-panel ${FAMILY_STYLE[type.family].band}`}
        >
          <Dialog.Close
            aria-label="Close"
            className="absolute top-3 right-3 z-10 grid size-11 cursor-pointer place-items-center rounded-full bg-cine-base text-cine-ink transition-colors hover:bg-cine-ink hover:text-cine-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cine-ink"
          >
            <X size={20} weight="bold" aria-hidden />
          </Dialog.Close>
          <div className="overflow-y-auto overscroll-contain px-5 pt-16 pb-8 sm:px-10 sm:pt-12 sm:pb-10">
            <TypeDetail type={type} dialog />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
