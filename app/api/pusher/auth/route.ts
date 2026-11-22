import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPusher } from "@/lib/pusher";

export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const socketId = String(form.get("socket_id") ?? "");
  const channel = String(form.get("channel_name") ?? "");
  if (!socketId || (!channel.startsWith("private-conversation-") && channel !== "private-admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (channel === "private-admin" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (channel === "private-admin") {
    if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const pusher = getPusher();
    if (!pusher) return NextResponse.json({ error: "Realtime is not configured" }, { status: 503 });
    return NextResponse.json(pusher.authenticate(socketId, channel));
  }
  const conversationId = channel.replace("private-conversation-", "");
  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conversation) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (session.user.role === "USER" && conversation.userId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (session.user.role !== "ADMIN") {
    // regular users are only allowed to authorize their own conversation channel
  }
  const pusher = getPusher();
  if (!pusher) return NextResponse.json({ error: "Realtime is not configured" }, { status: 503 });
  return NextResponse.json(pusher.authenticate(socketId, channel));
}
