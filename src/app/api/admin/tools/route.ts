import { NextResponse } from "next/server";
import { z } from "zod";
import { getDbPool } from "@/lib/db";
import { getSession, jsonError } from "@/lib/auth";

const createSchema = z.object({
  branchId: z.number().int().nullable().optional(),
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  previewUrl: z.string().url().nullable().optional(),
  videoUrl: z.string().url().nullable().optional(),
  status: z.enum(["Aktiv", "In Prüfung", "Entwurf"]),
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
  const [rows] = await pool.query(
    "SELECT id, branch_id, title, description, preview_url, video_url, status, sort_order FROM tools ORDER BY sort_order ASC, id ASC",
  );
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const ok = await requireAdmin();
  if (!ok) return jsonError("Nicht autorisiert", 401);
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return jsonError("Ungültige Eingabe", 400);
  const { branchId = null, title, description, previewUrl = null, status, sortOrder = 0 } = parsed.data;
  const pool = getDbPool();
  await pool.query(
    "INSERT INTO tools (branch_id, title, description, preview_url, video_url, status, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [branchId, title, description, previewUrl, parsed.data.videoUrl ?? null, status, sortOrder],
  );
  return NextResponse.json({ ok: true });
}

export async function PUT(req: Request) {
  const ok = await requireAdmin();
  if (!ok) return jsonError("Nicht autorisiert", 401);
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return jsonError("Ungültige Eingabe", 400);
  const { id, branchId = null, title, description, previewUrl = null, videoUrl = null, status, sortOrder = 0 } =
    parsed.data;
  const pool = getDbPool();
  await pool.query(
    "UPDATE tools SET branch_id = ?, title = ?, description = ?, preview_url = ?, video_url = ?, status = ?, sort_order = ? WHERE id = ?",
    [branchId, title, description, previewUrl, videoUrl, status, sortOrder, id],
  );
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
  await pool.query("DELETE FROM tools WHERE id = ?", [id]);
  return NextResponse.json({ ok: true });
}
