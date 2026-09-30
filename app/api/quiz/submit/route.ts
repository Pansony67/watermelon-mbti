import { hasDatabase, insertResponse, noDatabase } from "@/lib/db";
import { isAnswerSet } from "@/lib/questions";
import { score } from "@/lib/scoring";

export async function POST(request: Request) {
  if (!hasDatabase) return noDatabase();
  const body: unknown = await request.json().catch(() => null);
  const answers = body && typeof body === "object" ? (body as { answers?: unknown }).answers : null;
  if (!isAnswerSet(answers)) {
    return Response.json({ error: "answers must be 20 integers from 1 to 7" }, { status: 400 });
  }
  const { type } = score(answers);
  const deleteToken = await insertResponse(answers, type.slug);
  return Response.json({ resultKey: type.slug, deleteToken });
}
