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
  const totals = {
    users: await prisma.user.count({ where: { role: "USER" } }),
    conversations: conversations.length,
    unread: conversations.reduce((sum, item) => sum + item.adminUnreadCount, 0),
    awaiting: conversations.filter((item) => item.lastMessageSender === "USER").length,
    active: conversations.filter((item) => item.status === "OPEN").length,
    resolved: conversations.filter((item) => item.status === "RESOLVED").length,
  };
  const nowMs = now.getTime();
  return NextResponse.json({
    conversations: conversations.map(({ user, ...conversation }) => ({
      ...conversation,
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
    })),
    totals,
  });
}
