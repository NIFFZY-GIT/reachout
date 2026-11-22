import { NextResponse } from "next/server";
import { requireAuth, touchSession } from "@/lib/auth";

export async function GET() {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ authenticated: false }, { status: 401 });
  await touchSession();
  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.user.id,
      username: session.user.username,
      role: session.user.role,
    },
    expiresAt: session.expiresAt.toISOString(),
  });
}
