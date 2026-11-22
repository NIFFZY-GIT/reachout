import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ conversationId: string }> },
) {
  const session = await requireAuth("ADMIN");
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { conversationId } = await context.params;
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { id: true, userId: true, user: { select: { role: true } } },
  });
  if (!conversation || conversation.user.role !== "USER") {
    return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  }

  const now = new Date();
  const deletedAt = new Date(now.getTime() + 10 * 60 * 1000);
  await prisma.$transaction(async (tx) => {
    await tx.userSession.updateMany({
      where: { userId: conversation.userId, revokedAt: null },
      data: { revokedAt: now },
    });
    await tx.userMessage.deleteMany({
      where: { conversationId, createdAt: { lte: now } },
    });
    await tx.conversation.update({
      where: { id: conversationId },
      data: {
        deletionStatus: "PENDING",
        deletionScheduledAt: deletedAt,
        userUnreadCount: 0,
        userTypingUntil: null,
      },
    });
  });

  return NextResponse.json({ ok: true });
}
