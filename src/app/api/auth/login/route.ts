export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, findUserByEmail, jsonError, verifyPassword } from "@/lib/auth";

const schema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Ungültige Eingabe", 400);
    }

    const { email, password } = parsed.data;
    const user = await findUserByEmail(email);
    if (!user) return jsonError("Nutzer nicht gefunden", 401);

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return jsonError("Falsche Zugangsdaten", 401);

    await createSession({ sub: user.id, role: user.role });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : "Login fehlgeschlagen", 500);
  }
}
