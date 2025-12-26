import { NextResponse } from "next/server";
import { z } from "zod";
import { getDbPool } from "@/lib/db";
import { getSession, jsonError } from "@/lib/auth";

const createSchema = z.object({
  toolId: z.number().int(),
  customerId: z.number().int(),
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
  const [rows] = await pool.query(
    "SELECT id, tool_id, customer_id FROM tools_customers ORDER BY id ASC",
  );
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const ok = await requireAdmin();
  if (!ok) return jsonError("Nicht autorisiert", 401);
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return jsonError("Ungültige Eingabe", 400);
  const { toolId, customerId } = parsed.data;
  const pool = getDbPool();
  await pool.query("INSERT INTO tools_customers (tool_id, customer_id) VALUES (?, ?)", [toolId, customerId]);
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
  await pool.query("DELETE FROM tools_customers WHERE id = ?", [id]);
  return NextResponse.json({ ok: true });
}
