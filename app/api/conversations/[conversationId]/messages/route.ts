import { after, NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPusher } from "@/lib/pusher";
import { sendAdminMessageNotification } from "@/lib/email";

const schema = z.object({
  text: z.string().trim().max(5000).optional(),
  image: z
    .string()
    .regex(/^data:image\/(jpeg|png|webp|gif);base64,/i)
    .max(4 * 1024 * 1024)
    .optional(),
}).refine((value) => Boolean(value.text?.trim()) || Boolean(value.image), {
  message: "A message or image is required.",
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ conversationId: string }> },
) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { conversationId } = await context.params;
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { user: { select: { username: true } } },
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
  const isImage = Boolean(parsed.data.image);
  const storedText = parsed.data.image || parsed.data.text?.trim() || "";
  const messageType = isImage ? "IMAGE" : "TEXT";
  const conversationPreview = isImage ? "📷 Image" : storedText;
  const result = await prisma.$transaction(async (tx) => {
    const userMessage = await tx.userMessage.create({
      data: {
        conversationId,
        senderId: session.userId,
        senderRole,
        text: storedText,
        messageType,
      },
    });
    const adminMessage = await tx.adminMessage.create({
      data: {
        conversationId,
        senderId: session.userId,
        senderRole,
        text: storedText,
        messageType,
      },
    });
    await tx.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessage: conversationPreview,
        lastMessageAt: new Date(),
        lastMessageSender: senderRole,
        adminUnreadCount: senderRole === "USER" ? { increment: 1 } : undefined,
        userUnreadCount: senderRole === "ADMIN" ? { increment: 1 } : undefined,
        userTypingUntil: senderRole === "USER" ? null : undefined,
        adminTypingUntil: senderRole === "ADMIN" ? null : undefined,
      },
    });
    return { userMessage, adminMessage };
  });

  after(async () => {
    const pusher = getPusher();
    if (pusher) {
      await pusher
        .trigger(`private-conversation-${conversationId}`, "message:new", {
          id: result.userMessage.id,
          senderRole,
        })
        .catch((error) => console.error("Conversation realtime event failed", error));
      if (senderRole === "USER") {
        await pusher
          .trigger("private-admin", "conversation:new", { conversationId })
          .catch((error) => console.error("Admin inbox realtime event failed", error));
      }
    }
    if (senderRole === "USER") {
      try {
        const admins = await prisma.user.findMany({
          where: { role: "ADMIN", isActive: true, email: { not: null } },
          select: { email: true },
        });
        const recipients = new Set(
          admins.flatMap((admin) => (admin.email ? [admin.email] : [])),
        );
        if (process.env.ADMIN_EMAIL?.trim()) {
          recipients.add(process.env.ADMIN_EMAIL.trim());
        }
        if (recipients.size === 0) {
          throw new Error("No admin email recipient is configured.");
        }
        const results = await Promise.allSettled(
          [...recipients].map((to) =>
            sendAdminMessageNotification(
              to,
              conversation.user.username,
              conversationId,
            ),
          ),
        );
        results.forEach((result) => {
          if (result.status === "rejected") {
            console.error("Admin message notification email failed", result.reason);
          }
        });
      } catch (error) {
        console.error("Could not send admin message notification emails", error);
      }
    }
  });
  return NextResponse.json(
    { message: senderRole === "ADMIN" ? result.adminMessage : result.userMessage },
    { status: 201 },
  );
}
