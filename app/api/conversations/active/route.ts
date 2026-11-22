import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await requireAuth("USER");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let conversation = await prisma.conversation.findFirst({
    where: { userId: session.userId, status: { not: "ARCHIVED" } },
    orderBy: { createdAt: "desc" },
  });
  let isNewConversation = false;
  if (!conversation) {
    conversation = await prisma.conversation.create({ data: { userId: session.userId } });
    isNewConversation = true;
  } else {
    const activeConversation = conversation;
    const now = new Date();
    await prisma.$transaction(async (tx) => {
      if (activeConversation.deletionStatus !== "NONE" && activeConversation.deletionScheduledAt) {
        const logoutAt = new Date(activeConversation.deletionScheduledAt.getTime() - 10 * 60 * 1000);
        await tx.userMessage.deleteMany({
          where: { conversationId: activeConversation.id, createdAt: { lte: logoutAt } },
        });
        await tx.conversation.update({
          where: { id: activeConversation.id },
          data: {
            status: "OPEN",
            deletionStatus: "NONE",
            deletionScheduledAt: null,
          },
        });
      } else if (activeConversation.status !== "OPEN") {
        await tx.conversation.update({
          where: { id: activeConversation.id },
          data: { status: "OPEN" },
        });
      }
      await tx.userMessage.updateMany({
        where: { conversationId: activeConversation.id, senderRole: "ADMIN", isRead: false },
        data: { isRead: true, readAt: now },
      });
      await tx.adminMessage.updateMany({
        where: { conversationId: activeConversation.id, senderRole: "ADMIN", isRead: false },
        data: { isRead: true, readAt: now },
      });
      await tx.conversation.updateMany({
        where: { id: activeConversation.id, userUnreadCount: { gt: 0 } },
        data: { userUnreadCount: 0 },
      });
    });
  }
  const after = request.nextUrl.searchParams.get("after");
  const afterDate = after ? new Date(after) : null;
  const messages = await prisma.userMessage.findMany({
    where: {
      conversationId: conversation.id,
      ...(afterDate && !Number.isNaN(afterDate.getTime())
        ? { createdAt: { gte: new Date(afterDate.getTime() - 2000) } }
        : {}),
    },
    orderBy: { createdAt: "asc" },
  });
  const receipts = await prisma.userMessage.findMany({
    where: { conversationId: conversation.id, senderRole: "USER" },
    select: { id: true, isRead: true, readAt: true },
  });
  const presenceNow = new Date();
  const activeAdminSession = await prisma.userSession.findFirst({
    where: {
      revokedAt: null,
      expiresAt: { gt: presenceNow },
      lastActivityAt: { gt: new Date(presenceNow.getTime() - 90 * 1000) },
      user: { is: { role: "ADMIN", isActive: true } },
    },
    select: { id: true },
  });
  return NextResponse.json({
    conversation: {
      id: conversation.id,
      status: "OPEN",
      isNewConversation,
      adminTypingUntil: conversation.adminTypingUntil,
      adminIsOnline: Boolean(activeAdminSession),
      adminIsTyping:
        Boolean(conversation.adminTypingUntil) &&
        conversation.adminTypingUntil!.getTime() > Date.now(),
    },
    messages,
    receipts,
  }, {
    headers: { "Cache-Control": "no-store, private" },
  });
}
