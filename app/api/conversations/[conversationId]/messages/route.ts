import { after, NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPusher } from "@/lib/pusher";
import { sendReplyNotification } from "@/lib/email";

const schema = z.object({ text: z.string().trim().min(1).max(5000) });

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ conversationId: string }> },
) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { conversationId } = await context.params;
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { user: { select: { email: true } } },
  });
  if (!conversation) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  if (session.user.role === "USER" && conversation.userId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (session.user.role === "USER" && conversation.status !== "OPEN") {
    return NextResponse.json({ error: "This conversation is closed." }, { status: 409 });
  }
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Message is invalid." }, { status: 400 });

  const senderRole = session.user.role;
  const result = await prisma.$transaction(async (tx) => {
    const userMessage = await tx.userMessage.create({
      data: {
        conversationId,
        senderId: session.userId,
        senderRole,
        text: parsed.data.text,
      },
    });
    await tx.adminMessage.create({
      data: {
        conversationId,
        senderId: session.userId,
        senderRole,
        text: parsed.data.text,
      },
    });
    await tx.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessage: parsed.data.text,
        lastMessageAt: new Date(),
        lastMessageSender: senderRole,
        adminUnreadCount: senderRole === "USER" ? { increment: 1 } : undefined,
        userUnreadCount: senderRole === "ADMIN" ? { increment: 1 } : undefined,
        userTypingUntil: senderRole === "USER" ? null : undefined,
        adminTypingUntil: senderRole === "ADMIN" ? null : undefined,
      },
    });
    return userMessage;
  });

  after(async () => {
    const pusher = getPusher();
    if (pusher) {
      await pusher
        .trigger(`private-conversation-${conversationId}`, "message:new", {
          id: result.id,
          senderRole,
        })
        .catch((error) => console.error("Conversation realtime event failed", error));
      if (senderRole === "USER") {
        await pusher
          .trigger("private-admin", "conversation:new", { conversationId })
          .catch((error) => console.error("Admin inbox realtime event failed", error));
      }
    }
    if (senderRole === "ADMIN" && conversation.user.email) {
      await sendReplyNotification(conversation.user.email).catch((error) => {
        console.error("Reply notification email failed", error);
      });
    }
  });
  return NextResponse.json({ message: result }, { status: 201 });
}
