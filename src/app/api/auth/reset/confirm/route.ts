export const runtime = "nodejs";

import { z } from "zod";
import { jsonError, resetPasswordWithToken } from "@/lib/auth";

const schema = z.object({
  token: z.string().min(10).max(256),
  password: z.string().min(8).max(128),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Ungültige Eingabe", 400);
  }

  const { token, password } = parsed.data;
  const result = await resetPasswordWithToken(token, password);
  if (!result.ok) {
    return jsonError("Token ungueltig oder abgelaufen", 400);
  }

  return Response.json({ ok: true });
}
