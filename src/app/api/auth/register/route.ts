export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, createUser, findUserByEmail, jsonError } from "@/lib/auth";

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
    const existing = await findUserByEmail(email);
    if (existing) {
      return jsonError("Nutzer existiert bereits", 400);
    }

    await createUser(email, password, "member");
    const user = await findUserByEmail(email);
    if (!user) return jsonError("Nutzer konnte nicht erstellt werden", 500);

    await createSession({ sub: user.id, role: user.role });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return jsonError(
      err instanceof Error ? err.message : "Registrierung fehlgeschlagen",
      500,
    );
  }
}
