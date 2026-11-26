import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireAuth("ADMIN");
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const now = new Date();
  const conversations = await prisma.conversation.findMany({
    orderBy: { lastMessageAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          lastSeen: true,
          sessions: {
            where: { revokedAt: null, expiresAt: { gt: now } },
            orderBy: { expiresAt: "desc" },
            take: 1,
            select: { expiresAt: true },
          },
        },
      },
      adminMessages: { orderBy: { createdAt: "desc" }, take: 1 },
      adminNotes: { orderBy: { createdAt: "desc" }, take: 3 },
    },
  });
  const latestByUser = new Map<string, (typeof conversations)[number]>();
  for (const conversation of conversations) {
    const existing = latestByUser.get(conversation.userId);
    if (
      !existing ||
      (conversation.lastMessageAt?.getTime() ?? conversation.createdAt.getTime()) >
        (existing.lastMessageAt?.getTime() ?? existing.createdAt.getTime())
    ) {
      latestByUser.set(conversation.userId, conversation);
    }
  }
  const uniqueConversations = [...latestByUser.values()];
  const totals = {
    users: await prisma.user.count({ where: { role: "USER" } }),
    conversations: uniqueConversations.length,
    unread: uniqueConversations.reduce((sum, item) => {
      const duplicates = conversations.filter(
        (candidate) => candidate.userId === item.userId,
      );
      return sum + duplicates.reduce((count, candidate) => count + candidate.adminUnreadCount, 0);
    }, 0),
    awaiting: uniqueConversations.filter((item) => item.lastMessageSender === "USER").length,
    active: uniqueConversations.filter((item) => item.status === "OPEN").length,
    resolved: uniqueConversations.filter((item) => item.status === "RESOLVED").length,
  };
  const nowMs = now.getTime();
  return NextResponse.json({
    conversations: uniqueConversations.map(({ user, ...conversation }) => {
      const duplicates = conversations.filter(
        (candidate) => candidate.userId === conversation.userId,
      );
      return {
        ...conversation,
        adminUnreadCount: duplicates.reduce(
          (count, candidate) => count + candidate.adminUnreadCount,
          0,
        ),
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          lastSeen: user.lastSeen,
        },
        userSessionExpiresAt: user.sessions[0]?.expiresAt ?? null,
        userIsTyping:
          Boolean(conversation.userTypingUntil) &&
          conversation.userTypingUntil!.getTime() > nowMs,
      };
    }),
    totals,
  });
}
