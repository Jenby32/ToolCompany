export const runtime = "nodejs";

import { z } from "zod";
import { createPasswordResetToken, findUserByEmail, jsonError } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";

const schema = z.object({
  email: z.string().email().max(255),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Ungültige Eingabe", 400);
  }

  const { email } = parsed.data;
  const user = await findUserByEmail(email);

  if (user) {
    const token = await createPasswordResetToken(user.id);
    const origin = process.env.APP_BASE_URL ?? new URL(req.url).origin;
    const resetLink = `${origin}/reset?token=${encodeURIComponent(token)}`;

    try {
      await sendPasswordResetEmail(email, resetLink);
    } catch (err) {
      console.error("[reset-request] Senden der E-Mail fehlgeschlagen", err);
      // Rückmeldung bleibt generisch, um Konten nicht offenzulegen
    }
  }

  return Response.json({ ok: true });
}
