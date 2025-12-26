import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDbPool } from "./db";

const COOKIE_NAME = "session_token";
const SESSION_TTL = 60 * 60 * 24 * 7; // 7 Tage

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET fehlt");
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function updateUserPassword(userId: string, password: string) {
  const pool = getDbPool();
  const passwordHash = await hashPassword(password);
  await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [
    passwordHash,
    userId,
  ]);
}

export type SessionPayload = {
  sub: string;
  role: "admin" | "member" | "customer";
};

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL}s`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      sub: String(payload.sub),
      role: payload.role as SessionPayload["role"],
    };
  } catch {
    return null;
  }
}

export async function findUserByEmail(email: string) {
  const pool = getDbPool();
  const [rows] = await pool.query(
    "SELECT id, email, password_hash, role FROM users WHERE email = ? LIMIT 1",
    [email],
  );
  const row = (rows as { id: string; email: string; password_hash: string; role: string }[])[0];
  if (!row) return null;
  return {
    id: String(row.id),
    email: String(row.email),
    passwordHash: String(row.password_hash),
    role: row.role as SessionPayload["role"],
  };
}

export async function createUser(email: string, password: string, role: SessionPayload["role"]) {
  const pool = getDbPool();
  const passwordHash = await hashPassword(password);
  await pool.query("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)", [
    email,
    passwordHash,
    role,
  ]);
}

type PasswordResetRow = {
  id: number;
  user_id: number;
};

export async function createPasswordResetToken(userId: string, expiresMinutes = 60) {
  const pool = getDbPool();
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);

  await pool.query("DELETE FROM password_resets WHERE expires_at < NOW() OR used_at IS NOT NULL");
  await pool.query("DELETE FROM password_resets WHERE user_id = ?", [userId]);
  await pool.query(
    "INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
    [userId, tokenHash, expiresAt],
  );

  return token;
}

export async function resetPasswordWithToken(token: string, newPassword: string) {
  const pool = getDbPool();
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();
    const [rows] = await conn.query(
      "SELECT id, user_id FROM password_resets WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW() LIMIT 1 FOR UPDATE",
      [tokenHash],
    );

    const row = (rows as PasswordResetRow[])[0];
    if (!row) {
      await conn.rollback();
      return { ok: false as const, error: "Token ungueltig oder abgelaufen" };
    }

    const passwordHash = await hashPassword(newPassword);
    await conn.query("UPDATE users SET password_hash = ? WHERE id = ?", [passwordHash, row.user_id]);
    await conn.query("UPDATE password_resets SET used_at = NOW() WHERE id = ?", [row.id]);
    await conn.commit();

    return { ok: true as const, userId: String(row.user_id) };
  } catch (err) {
    await conn.rollback();
    return { ok: false as const, error: err instanceof Error ? err.message : "Zurücksetzen fehlgeschlagen" };
  } finally {
    conn.release();
  }
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
