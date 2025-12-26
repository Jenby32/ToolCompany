import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

/**
 * Liefert einen gemeinsamen MySQL-Pool, damit mehrere Routen dieselben Verbindungen nutzen.
 */
export function getDbPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL fehlt. Bitte in der .env hinterlegen.");
  }

  if (!pool) {
    pool = mysql.createPool({
      uri: process.env.DATABASE_URL,
      connectionLimit: 5,
      queueLimit: 0,
    });
  }

  return pool;
}

export async function pingDatabase() {
  const started = performance.now();

  try {
    const conn = await getDbPool().getConnection();
    try {
      await conn.ping();
    } finally {
      conn.release();
    }
    const latencyMs = Number((performance.now() - started).toFixed(2));
    return { ok: true, latencyMs };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unbekannter Datenbankfehler",
    };
  }
}
