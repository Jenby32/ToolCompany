import { NextResponse } from "next/server";
import { z } from "zod";
import { getDbPool } from "@/lib/db";
import { getSession, jsonError } from "@/lib/auth";

const createSchema = z.object({
  name: z.string().min(1).max(255),
  contactEmail: z.string().email().max(255).nullable().optional(),
  contactPhone: z.string().max(50).nullable().optional(),
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
  const [rows] = await pool.query("SELECT id, name, contact_email, contact_phone FROM customers ORDER BY id ASC");
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const ok = await requireAdmin();
  if (!ok) return jsonError("Nicht autorisiert", 401);
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return jsonError("Ungültige Eingabe", 400);
  const { name, contactEmail = null, contactPhone = null } = parsed.data;
  const pool = getDbPool();
  await pool.query("INSERT INTO customers (name, contact_email, contact_phone) VALUES (?, ?, ?)", [
    name,
    contactEmail,
    contactPhone,
  ]);
  return NextResponse.json({ ok: true });
}

export async function PUT(req: Request) {
  const ok = await requireAdmin();
  if (!ok) return jsonError("Nicht autorisiert", 401);
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return jsonError("Ungültige Eingabe", 400);
  const { id, name, contactEmail = null, contactPhone = null } = parsed.data;
  const pool = getDbPool();
  await pool.query("UPDATE customers SET name = ?, contact_email = ?, contact_phone = ? WHERE id = ?", [
    name,
    contactEmail,
    contactPhone,
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
  await pool.query("DELETE FROM customers WHERE id = ?", [id]);
  return NextResponse.json({ ok: true });
}
