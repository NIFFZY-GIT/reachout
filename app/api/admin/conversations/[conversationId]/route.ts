import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  status: z.enum(["OPEN", "RESOLVED", "ARCHIVED"]).optional(),
  safetyFlag: z.enum(["NORMAL", "NEEDS_ATTENTION", "URGENT_SAFETY_CONCERN"]).optional(),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ conversationId: string }> },
) {
  const session = await requireAuth("ADMIN");
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { conversationId } = await context.params;
  const after = request.nextUrl.searchParams.get("after");
  const afterDate = after ? new Date(after) : null;
  const now = new Date();
  await prisma.$transaction([
    prisma.adminMessage.updateMany({
      where: { conversationId, senderRole: "USER", isRead: false },
      data: { isRead: true, readAt: now },
    }),
    prisma.userMessage.updateMany({
      where: { conversationId, senderRole: "USER", isRead: false },
      data: { isRead: true, readAt: now },
    }),
    prisma.conversation.updateMany({
      where: { id: conversationId, adminUnreadCount: { gt: 0 } },
      data: { adminUnreadCount: 0 },
    }),
  ]);
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          sessions: {
            where: { revokedAt: null, expiresAt: { gt: now } },
            orderBy: { expiresAt: "desc" },
            take: 1,
            select: { expiresAt: true },
          },
        },
      },
      adminMessages: {
        where:
          afterDate && !Number.isNaN(afterDate.getTime())
            ? { createdAt: { gte: new Date(afterDate.getTime() - 2000) } }
            : undefined,
        orderBy: { createdAt: "asc" },
      },
      adminNotes: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { user, ...conversationData } = conversation;
  const receipts = await prisma.adminMessage.findMany({
    where: { conversationId, senderRole: "ADMIN" },
    select: { id: true, isRead: true, readAt: true },
  });
  return NextResponse.json({
    conversation: {
      ...conversationData,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      userSessionExpiresAt: user.sessions[0]?.expiresAt ?? null,
      userIsTyping:
        Boolean(conversation.userTypingUntil) &&
        conversation.userTypingUntil!.getTime() > Date.now(),
    },
    receipts,
  }, {
    headers: { "Cache-Control": "no-store, private" },
  });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ conversationId: string }> },
) {
  const session = await requireAuth("ADMIN");
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  const { conversationId } = await context.params;
  const conversation = await prisma.conversation.update({
    where: { id: conversationId },
    data: parsed.data,
  });
  return NextResponse.json({ conversation });
}
