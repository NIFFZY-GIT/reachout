import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  if (process.env.RETENTION_SECRET && request.headers.get("x-retention-secret") !== process.env.RETENTION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const due = await prisma.conversation.findMany({
    where: {
      deletionStatus: "PENDING",
      deletionScheduledAt: { lte: new Date() },
    },
  });
  for (const conversation of due) {
    const logoutAt = conversation.deletionScheduledAt
      ? new Date(conversation.deletionScheduledAt.getTime() - 10 * 60 * 1000)
      : new Date();
    await prisma.$transaction([
      prisma.userMessage.deleteMany({
        where: { conversationId: conversation.id, createdAt: { lte: logoutAt } },
      }),
      prisma.conversation.update({
        where: { id: conversation.id },
        data: { deletionStatus: "COMPLETED" },
      }),
    ]);
  }
  return NextResponse.json({ completed: due.length });
}
