import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  note: z.string().trim().min(1).max(5000),
});

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ conversationId: string; noteId: string }> },
) {
  const session = await requireAuth("ADMIN");
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid note text." }, { status: 400 });
  }

  const { conversationId, noteId } = await context.params;

  const existing = await prisma.adminNote.findFirst({
    where: { id: noteId, conversationId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Note not found." }, { status: 404 });
  }

  const updated = await prisma.adminNote.update({
    where: { id: noteId },
    data: { note: parsed.data.note },
  });

  return NextResponse.json({ note: updated });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ conversationId: string; noteId: string }> },
) {
  const session = await requireAuth("ADMIN");
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { conversationId, noteId } = await context.params;

  const existing = await prisma.adminNote.findFirst({
    where: { id: noteId, conversationId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Note not found." }, { status: 404 });
  }

  await prisma.adminNote.delete({
    where: { id: noteId },
  });

  return NextResponse.json({ ok: true });
}
