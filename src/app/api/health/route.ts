import { NextResponse } from "next/server";
import { pingDatabase } from "@/lib/db";

export async function GET() {
  try {
    const result = await pingDatabase();

    if (!result.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: result.error,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      status: "ok",
      latencyMs: result.latencyMs,
      engine: "mysql",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 },
    );
  }
}
