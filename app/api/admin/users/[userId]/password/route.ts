import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  password: z.string().min(10).max(128),
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  const session = await requireAuth("ADMIN");
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Password must be between 10 and 128 characters." }, { status: 400 });
  }

  const { userId } = await context.params;
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const now = new Date();
  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.user.updateMany({
      where: { id: userId, role: "USER" },
      data: { passwordHash },
    });
    if (result.count === 0) return false;
    await tx.userSession.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: now },
    });
    return true;
  });

  if (!updated) return NextResponse.json({ error: "User not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
