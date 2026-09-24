import GridBackground from "@/components/GridBackground";

/**
 * The quiz room: the landing page's grid on a soft grey page, with a coral
 * pool that warms up as the test fills in (`progress` runs 0 to 1).
 */
export default function QuizBackdrop({ progress }: { progress: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-paper-2">
      <GridBackground className="grid-fade text-line" squares={18} />

      <div className="absolute top-[86%] left-[82%] aspect-square w-[min(90vw,820px)] -translate-x-1/2 -translate-y-1/2">
        <div
          className="stage-warmth drift h-full w-full transition-opacity duration-700 ease-settle"
          style={{ opacity: 0.35 + progress * 0.65 }}
        />
      </div>
    </div>
  );
}
