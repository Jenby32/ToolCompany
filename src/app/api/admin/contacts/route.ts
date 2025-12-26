import { NextResponse } from "next/server";
import { z } from "zod";
import { getDbPool } from "@/lib/db";
import { getSession, jsonError } from "@/lib/auth";

const createSchema = z.object({
  label: z.string().min(1).max(255),
  value: z.string().min(1).max(512),
  kind: z.enum(["email", "phone", "link"]),
  sortOrder: z.number().int().optional(),
});

const updateSchema = createSchema.extend({
  id: z.number().int(),
});

const deleteSchema = z.object({
  id: z.number().int(),
});

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return false;
  }
  return true;
}

export async function GET() {
  const ok = await requireAdmin();
  if (!ok) return jsonError("Nicht autorisiert", 401);
  const pool = getDbPool();
  const [rows] = await pool.query("SELECT id, label, value, kind, sort_order FROM contacts ORDER BY sort_order ASC, id ASC");
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const ok = await requireAdmin();
  if (!ok) return jsonError("Nicht autorisiert", 401);
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return jsonError("Ungültige Eingabe", 400);
  const { label, value, kind, sortOrder = 0 } = parsed.data;
  const pool = getDbPool();
  await pool.query("INSERT INTO contacts (label, value, kind, sort_order) VALUES (?, ?, ?, ?)", [
    label,
    value,
    kind,
    sortOrder,
  ]);
  return NextResponse.json({ ok: true });
}

export async function PUT(req: Request) {
  const ok = await requireAdmin();
  if (!ok) return jsonError("Nicht autorisiert", 401);
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return jsonError("Ungültige Eingabe", 400);
  const { id, label, value, kind, sortOrder = 0 } = parsed.data;
  const pool = getDbPool();
  await pool.query("UPDATE contacts SET label = ?, value = ?, kind = ?, sort_order = ? WHERE id = ?", [
    label,
    value,
    kind,
    sortOrder,
    id,
  ]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const ok = await requireAdmin();
  if (!ok) return jsonError("Nicht autorisiert", 401);
  const body = await req.json().catch(() => null);
  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) return jsonError("Ungültige Eingabe", 400);
  const { id } = parsed.data;
  const pool = getDbPool();
  await pool.query("DELETE FROM contacts WHERE id = ?", [id]);
  return NextResponse.json({ ok: true });
}
