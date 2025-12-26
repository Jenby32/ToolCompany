import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2/promise";
import { getDbPool } from "@/lib/db";
import type { ContentResponse } from "@/lib/content-types";

export async function GET() {
  try {
    const pool = getDbPool();

    const [branchesRows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, summary, sort_order FROM branches ORDER BY sort_order ASC, id ASC",
    );
    const [toolsRows] = await pool.query<RowDataPacket[]>(
      "SELECT id, branch_id, title, description, preview_url, video_url, status, sort_order FROM tools ORDER BY sort_order ASC, id ASC",
    );
    const [contactsRows] = await pool.query<RowDataPacket[]>(
      "SELECT id, label, value, kind, sort_order FROM contacts ORDER BY sort_order ASC, id ASC",
    );
    const [customersRows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, contact_email, contact_phone FROM customers ORDER BY id ASC",
    );
    const [toolsCustomersRows] = await pool.query<RowDataPacket[]>(
      "SELECT id, tool_id, customer_id FROM tools_customers ORDER BY id ASC",
    );

    const response: ContentResponse = {
      branches: branchesRows.map((row) => ({
        id: Number(row.id),
        name: String(row.name),
        summary: String(row.summary),
        sortOrder: Number(row.sort_order ?? 0),
      })),
      tools: toolsRows.map((row) => ({
        id: Number(row.id),
        branchId: row.branch_id != null ? Number(row.branch_id) : null,
        title: String(row.title),
        description: String(row.description),
        previewUrl: row.preview_url ? String(row.preview_url) : null,
        videoUrl: row.video_url ? String(row.video_url) : null,
        status: row.status as ContentResponse["tools"][number]["status"],
        sortOrder: Number(row.sort_order ?? 0),
        tags: [],
      })),
      contacts: contactsRows.map((row) => ({
        id: Number(row.id),
        label: String(row.label),
        value: String(row.value),
        kind: row.kind as ContentResponse["contacts"][number]["kind"],
        sortOrder: Number(row.sort_order ?? 0),
      })),
      customers: customersRows.map((row) => ({
        id: Number(row.id),
        name: String(row.name),
        contactEmail: row.contact_email ? String(row.contact_email) : null,
        contactPhone: row.contact_phone ? String(row.contact_phone) : null,
      })),
      toolsCustomers: toolsCustomersRows.map((row) => ({
        id: Number(row.id),
        toolId: Number(row.tool_id),
        customerId: Number(row.customer_id),
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unbekannter Datenbankfehler" },
      { status: 500 },
    );
  }
}
