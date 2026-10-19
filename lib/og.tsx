import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { EaterType } from "@/lib/types";

/** Share images: the size every network crops to, and the bits they all draw on. */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_HOST = "watermelon-mbti.vercel.app";

/** The site fonts as static TTF cuts: satori reads TTF, not the woff2 next/font serves. Same source as next/font. */
async function googleFont(query: string) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?${query}`)).text();
  const url = css.match(/src: url\((.+?)\) format\('truetype'\)/)?.[1];
  if (!url) throw new Error(`Google Fonts sent no TTF for ${query}`);
  return (await fetch(url)).arrayBuffer();
}

let fonts: Promise<{ name: string; data: ArrayBuffer; weight: 600 | 800; style: "normal" }[]> | undefined;

/** Fetched once per build, however many images use them. */
export function ogFonts() {
  fonts ??= Promise.all([
    googleFont("family=Bricolage+Grotesque:opsz,wght@96,800"),
    googleFont("family=Figtree:wght@600"),
  ]).then(([display, body]) => [
    { name: "Bricolage", data: display, weight: 800, style: "normal" },
    { name: "Figtree", data: body, weight: 600, style: "normal" },
  ]);
  return fonts;
}

/** A character's PNG, inlined: the image is rendered at build time, with no server to fetch it from. */
export async function characterSrc(type: EaterType) {
  const png = await readFile(join(process.cwd(), "public", type.image), "base64");
  return `data:image/png;base64,${png}`;
}

export function OgWordmark({ size, dark }: { size: number; dark: boolean }) {
  return (
    <div style={{ display: "flex", fontFamily: "Bricolage", fontSize: size, letterSpacing: "-0.02em", color: dark ? "#f4efec" : "#1d1715" }}>
      Melon<span style={{ color: dark ? "#ff7189" : "#d41e47" }}>ality</span>
    </div>
  );
}
