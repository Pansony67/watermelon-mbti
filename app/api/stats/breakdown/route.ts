import { resultBreakdown } from "@/lib/db";

// Never prerendered (needs the database); cached at the edge for a minute.
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await resultBreakdown(), {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
