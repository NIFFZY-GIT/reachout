import { NextResponse } from "next/server";
import { revokeCurrentSession, getSessionForLogout } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getSessionForLogout();
  if (session?.user.role === "USER") {
    const now = new Date();
    await prisma.$transaction(async (tx) => {
      const conversations = await tx.conversation.findMany({
        where: { userId: session.userId },
        select: { id: true },
      });
      await tx.userMessage.deleteMany({
        where: {
          conversationId: { in: conversations.map((conversation) => conversation.id) },
          createdAt: { lte: now },
        },
      });
      await tx.conversation.updateMany({
        where: { userId: session.userId },
        data: {
          deletionStatus: "PENDING",
          deletionScheduledAt: new Date(now.getTime() + 10 * 60 * 1000),
        },
      });
    });
  }
  await revokeCurrentSession();
  return NextResponse.json({ ok: true });
}
