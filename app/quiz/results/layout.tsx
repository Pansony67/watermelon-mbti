import type { Metadata } from "next";

/** The results page is a client page built from this browser's answers: nothing for a search engine to index. */
export const metadata: Metadata = {
  title: "Your result | Melonality",
  description: "Your watermelon type, family and five traits, from your own answers.",
  robots: { index: false },
};

export default function ResultsLayout({ children }: LayoutProps<"/quiz/results">) {
  return children;
}
