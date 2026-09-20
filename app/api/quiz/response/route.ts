import { deleteResponse } from "@/lib/db";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Removes the row that issued this token. Tokens are only ever handed to the player who created the row. */
export async function DELETE(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const token = body && typeof body === "object" ? (body as { token?: unknown }).token : null;
  if (typeof token !== "string" || !UUID.test(token)) {
    return Response.json({ error: "token must be a UUID" }, { status: 400 });
  }
  return new Response(null, { status: (await deleteResponse(token)) ? 204 : 404 });
}
