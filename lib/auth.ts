import "server-only";
import { cookies } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import { getPrisma } from "@/lib/prisma";
import { and } from "@prisma/orm-postgres/orm-client";

export const SESSION_COOKIE = "reachout_session";
export const SESSION_TTL_MS = 10 * 60 * 1000;

export type Role = "USER" | "ADMIN";

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const db = getPrisma();
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.orm.public.UserSession.create({
    userId,
    sessionTokenHash: hashToken(token),
    expiresAt,
  });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
  return token;
}

export async function getSession() {
  const db = getPrisma();
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await db.orm.public.UserSession.include("user")
    .where((s) =>
      and(
        s.sessionTokenHash.eq(hashToken(token)),
        s.revokedAt.isNull(),
        s.expiresAt.gt(new Date()),
      ),
    )
    .first();
  if (!session || !session.user.isActive) return null;
  return session;
}

export async function requireAuth(role?: Role) {
  const session = await getSession();
  if (!session) return null;
  if (role && session.user.role !== role) return null;
  return session;
}

export async function touchSession() {
  const db = getPrisma();
  const session = await getSession();
  if (!session) return null;
  const now = new Date();
  return db.orm.public.UserSession.where({ id: session.id }).update({
    lastActivityAt: now,
    expiresAt: new Date(now.getTime() + SESSION_TTL_MS),
  });
}

export async function revokeCurrentSession() {
  const db = getPrisma();
  const session = await getSession();
  if (!session) return;
  await db.orm.public.UserSession.where({ id: session.id }).update({
    revokedAt: new Date(),
  });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", { httpOnly: true, expires: new Date(0), path: "/" });
}
