import { NextResponse } from "next/server";
import { revokeCurrentSession, getSessionForLogout } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getSessionForLogout();
  if (session?.user.role === "USER") {
    await prisma.conversation.updateMany({
      where: { userId: session.userId, deletionStatus: "NONE" },
      data: { deletionStatus: "PENDING", deletionScheduledAt: new Date(Date.now() + 10 * 60 * 1000) },
    });
  }
  await revokeCurrentSession();
  return NextResponse.json({ ok: true });
}
