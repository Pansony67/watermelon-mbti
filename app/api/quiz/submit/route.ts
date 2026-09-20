import { insertResponse } from "@/lib/db";
import { isAnswerSet } from "@/lib/questions";
import { score } from "@/lib/scoring";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const answers = body && typeof body === "object" ? (body as { answers?: unknown }).answers : null;
  if (!isAnswerSet(answers)) {
    return Response.json({ error: "answers must be 20 integers from 1 to 7" }, { status: 400 });
  }
  const { resultKey, axisAPercent } = score(answers);
  const deleteToken = await insertResponse(answers, resultKey);
  return Response.json({ resultKey, axisAPercent, deleteToken });
}
