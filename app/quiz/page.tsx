import type { Metadata } from "next";
import QuizFlow from "@/components/QuizFlow";

export const metadata: Metadata = {
  title: "The Test | Watermelon MBTI",
  description: "Twenty statements, one watermelon type. Agree or disagree.",
};

export default function QuizPage() {
  return <QuizFlow />;
}
