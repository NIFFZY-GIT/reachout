import "server-only";
import { cookies } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export const SESSION_COOKIE = "reachout_session";
export const SESSION_TTL_MS = 10 * 60 * 1000;
const SESSION_LOGOUT_GRACE_MS = 60 * 1000;

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await prisma.userSession.create({
    data: { userId, sessionTokenHash: hashToken(token), expiresAt },
  });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt.getTime() + SESSION_LOGOUT_GRACE_MS),
  });
  return token;
}

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.userSession.findFirst({
    where: {
      sessionTokenHash: hashToken(token),
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });
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
  const session = await getSession();
  if (!session) return null;
  return prisma.userSession.update({
    where: { id: session.id },
    data: { lastActivityAt: new Date() },
  });
}

export async function getSessionForLogout() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.userSession.findFirst({
    where: {
      sessionTokenHash: hashToken(token),
      revokedAt: null,
      expiresAt: { gt: new Date(Date.now() - SESSION_LOGOUT_GRACE_MS) },
    },
    include: { user: true },
  });
  if (!session || !session.user.isActive) return null;
  return session;
}

export async function revokeCurrentSession() {
  const session = await getSessionForLogout();
  if (session) {
    await prisma.userSession.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });
  }
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", { httpOnly: true, expires: new Date(0), path: "/" });
}
