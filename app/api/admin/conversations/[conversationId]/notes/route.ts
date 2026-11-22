import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({ note: z.string().trim().min(1).max(5000) });

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ conversationId: string }> },
) {
  const session = await requireAuth("ADMIN");
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid note" }, { status: 400 });
  const { conversationId } = await context.params;
  const note = await prisma.adminNote.create({
    data: { conversationId, adminId: session.userId, note: parsed.data.note },
  });
  return NextResponse.json({ note }, { status: 201 });
}
