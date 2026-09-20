import Image from "next/image";

/**
 * Atmosphere behind the quiz card: a photograph graded down into the brand's
 * dark green, with the landing page's stage lighting and wet floor laid over
 * it, and a warm pool that brightens as the test fills in.
 *
 * The photo is `public/quiz-backdrop.jpg`. Currently "Sliced Watermelon" by
 * Harsha K R, Wikimedia Commons, CC BY-SA 2.0 (credited on screen, as the
 * licence requires). Drop the branded render in at the same path to replace
 * it; the grade and overlays below assume a full-colour source.
 *
 * All drift is transform-only and gated behind prefers-reduced-motion.
 */
export default function QuizBackdrop({ progress }: { progress: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <Image
        src="/quiz-backdrop.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="scale-[1.04] object-cover object-[50%_62%] [filter:brightness(0.3)_contrast(1.12)_saturate(1.2)_blur(2px)]"
      />

      {/* Green grade: shadows go rind-green, the flesh stays a deep crimson. */}
      <div className="absolute inset-0 bg-rind/30" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(7,24,16,0.9),rgba(7,24,16,0.25)_30%,rgba(7,24,16,0.2)_60%,#071810)]" />

      {/* Cool key light, upper left. */}
      <div className="absolute top-[18%] left-[12%] aspect-square w-[min(70vw,640px)] -translate-x-1/2 -translate-y-1/2">
        <div className="stage-cool drift-slow h-full w-full" />
      </div>

      {/* Stage light directly behind the card. */}
      <div className="stage-light absolute top-[50%] left-1/2 aspect-square w-[min(110vw,980px)] -translate-x-1/2 -translate-y-1/2" />

      {/* Warm pool, lower right. Brightens with progress: the room warms up as you go. */}
      <div className="absolute top-[86%] left-[82%] aspect-square w-[min(90vw,820px)] -translate-x-1/2 -translate-y-1/2">
        <div
          className="stage-warmth drift h-full w-full transition-opacity duration-700 ease-settle"
          style={{ opacity: 0.45 + progress * 0.55 }}
        />
      </div>

      {/* Vignette, as on the landing page. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_40%,var(--color-rind-deep)_100%)] opacity-75" />
    </div>
  );
}
