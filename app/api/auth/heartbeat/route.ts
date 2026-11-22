import { NextResponse } from "next/server";
import { touchSession, requireAuth } from "@/lib/auth";

export async function POST() {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ authenticated: false }, { status: 401 });
  await touchSession();
  return NextResponse.json({ ok: true });
}
