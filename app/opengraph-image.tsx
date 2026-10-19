import { ImageResponse } from "next/og";
import { OG_HOST, OG_SIZE, OgWordmark, characterSrc, ogFonts } from "@/lib/og";
import { FAMILIES, FAMILY_HEX, TYPES } from "@/lib/types";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Melonality: what kind of watermelon are you? Four of the twenty watermelon-headed characters.";

/** The site's card: the question, and one eater from each family on its stage. */
export default async function Image() {
  const cast = FAMILIES.map((family) => TYPES.find((t) => t.family === family)!);
  const srcs = await Promise.all(cast.map(characterSrc));
  const height = 214;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          color: "#1d1715",
          fontFamily: "Figtree",
          padding: "56px 64px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 540 }}>
          <OgWordmark size={34} dark={false} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "column", fontFamily: "Bricolage", fontSize: 80, lineHeight: 0.98, letterSpacing: "-0.035em" }}>
              <span>What kind of</span>
              <span style={{ color: "#dc2450" }}>watermelon</span>
              <span>are you?</span>
            </div>
            <div style={{ fontSize: 30, lineHeight: 1.3, color: "#5c5350", marginTop: 24, textWrap: "balance" }}>
              20 questions. 20 types. About 3 minutes.
            </div>
          </div>
          <div style={{ fontSize: 24, color: "#5c5350" }}>{OG_HOST}</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, width: 496, alignContent: "center" }}>
          {cast.map((type, i) => (
            <div
              key={type.slug}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                width: 240,
                height: 243,
                borderRadius: 28,
                overflow: "hidden",
                backgroundColor: FAMILY_HEX[type.family].band,
                backgroundImage: `radial-gradient(circle at 50% 100%, ${FAMILY_HEX[type.family].glow}55, transparent 70%)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- satori draws plain img */}
              <img src={srcs[i]} alt="" height={height} width={Math.round((height * type.imageWidth) / type.imageHeight)} />
            </div>
          ))}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await ogFonts() },
  );
}
