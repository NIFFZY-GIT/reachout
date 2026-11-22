import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({ typing: z.boolean() });

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ conversationId: string }> },
) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid typing state" }, { status: 400 });
  const { conversationId } = await context.params;
  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conversation) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  if (session.user.role === "USER" && conversation.userId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const until = parsed.data.typing ? new Date(Date.now() + 2500) : null;
  await prisma.conversation.update({
    where: { id: conversationId },
    data: session.user.role === "ADMIN"
      ? { adminTypingUntil: until }
      : { userTypingUntil: until },
  });
  return NextResponse.json({ ok: true });
}
