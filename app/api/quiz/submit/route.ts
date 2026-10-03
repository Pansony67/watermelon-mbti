import { allowSubmit, hasDatabase, insertResponse, noDatabase } from "@/lib/db";
import { parseAnswers, scoreQuiz } from "@/lib/scoring";

export async function POST(request: Request) {
  if (!hasDatabase) return noDatabase();
  const body: unknown = await request.json().catch(() => null);
  const answers = parseAnswers(body && typeof body === "object" ? (body as { answers?: unknown }).answers : null);
  if (!answers) {
    return Response.json(
      { error: "answers must be the 8 shared questions plus the 12 for the family they pick, each an integer from 1 to 7" },
      { status: 400 },
    );
  }
  // Vercel sets these to the visitor's address; without one (local development) nothing is counted.
  const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip && !(await allowSubmit(ip))) {
    return Response.json({ error: "Too many results saved from this address; try again later" }, { status: 429 });
  }
  // Recomputed here from the answers alone: the client's own result is never trusted.
  const result = scoreQuiz(answers);
  const deleteToken = await insertResponse(answers, result);
  return Response.json({
    slug: result.type.slug,
    family: result.family,
    familyScores: result.familyScores,
    typeScores: result.typeScores,
    traitScores: result.traits,
    deleteToken,
  });
}
