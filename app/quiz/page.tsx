import type { Metadata } from "next";
import QuizFlow from "@/components/QuizFlow";

export const metadata: Metadata = {
  title: "Take the quiz | Melonality",
  description: "Twenty statements about how you eat watermelon. Agree or disagree, about three minutes, no sign-up.",
  alternates: { canonical: "/quiz" },
};

export default function QuizPage() {
  return <QuizFlow />;
}
