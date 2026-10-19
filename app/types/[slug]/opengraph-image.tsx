import { ImageResponse } from "next/og";
import { OG_HOST, OG_SIZE, OgWordmark, characterSrc, ogFonts } from "@/lib/og";
import { FAMILY_HEX, FAMILY_INFO, TYPES } from "@/lib/types";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "A Melonality type card: a watermelon-headed character with its name and tagline";

export function generateStaticParams() {
  return TYPES.map(({ slug }) => ({ slug }));
}

/** The card a shared result shows in the chat: the character on its family's stage. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const type = TYPES.find((t) => t.slug === slug) ?? TYPES[0];
  const { band, glow } = FAMILY_HEX[type.family];
  // Full height, unless the pose is wide enough to reach the text: then cap the width instead.
  const height = Math.min(580, Math.round((460 * type.imageHeight) / type.imageWidth));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: band,
          backgroundImage: `radial-gradient(circle at 78% 70%, ${glow}4d, transparent 52%)`,
          color: "#f4efec",
          fontFamily: "Figtree",
          padding: "56px 64px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 650 }}>
          <OgWordmark size={34} dark />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 26, color: glow }}>{`${type.family} family · ${FAMILY_INFO[type.family].trait}`}</div>
            <div style={{ fontFamily: "Bricolage", fontSize: 84, lineHeight: 0.98, letterSpacing: "-0.035em", marginTop: 14 }}>
              {type.name}
            </div>
            <div style={{ fontSize: 32, lineHeight: 1.3, color: "#c7bdb8", marginTop: 22, maxWidth: 560, textWrap: "balance" }}>
              {type.tagline}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#c7bdb8" }}>
            Find yours at&nbsp;<span style={{ color: "#f4efec" }}>{OG_HOST}</span>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- satori draws plain img */}
        <img
          src={await characterSrc(type)}
          alt=""
          height={height}
          width={Math.round((height * type.imageWidth) / type.imageHeight)}
          style={{ position: "absolute", right: 72, bottom: 0 }}
        />
      </div>
    ),
    { ...OG_SIZE, fonts: await ogFonts() },
  );
}
