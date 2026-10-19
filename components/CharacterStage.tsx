import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { FAMILY_STYLE, type EaterType } from "@/lib/types";

/** CSS width of a figure drawn at `height` px, for next/image `sizes`. */
export const figureWidth = (type: EaterType, height: number) => Math.round((height * type.imageWidth) / type.imageHeight);

/**
 * A character standing on its family's stage: the family's deep colour, a
 * soft light in its glow colour, and the cutout outlined in that glow. The
 * figure is sized by height (`imgClass`), so every character stands equally
 * tall; `heights` are the same heights in px, phone first, for `sizes`.
 */
export default function CharacterStage({
  type,
  imgClass,
  heights,
  eager = false,
  decorative = false,
  className = "",
  children,
}: {
  type: EaterType;
  imgClass: string;
  heights: [phone: number, wide: number];
  eager?: boolean;
  /** True where the name is already right beside the art. */
  decorative?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`relative isolate flex items-end justify-center overflow-hidden ${FAMILY_STYLE[type.family].band} ${className}`}
      style={{ "--glow": `var(--cine-${type.family.toLowerCase()}-glow)` } as CSSProperties}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-[90%] bg-[radial-gradient(55%_60%_at_50%_78%,color-mix(in_srgb,var(--glow)_28%,transparent),transparent_75%)]"
      />
      <Image
        src={type.image}
        alt={decorative ? "" : type.alt}
        width={type.imageWidth}
        height={type.imageHeight}
        sizes={`(min-width: 640px) ${figureWidth(type, heights[1])}px, ${figureWidth(type, heights[0])}px`}
        loading={eager ? "eager" : "lazy"}
        className={`char-rim relative w-auto max-w-full object-contain ${imgClass}`}
      />
      {children}
    </div>
  );
}
