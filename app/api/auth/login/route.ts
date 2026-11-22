import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security";

const schema = z.object({
  identity: z.string().trim().min(3).max(254),
  password: z.string().min(1).max(128),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid login details." }, { status: 400 });
  const identity = parsed.data.identity.toLowerCase();
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identity }, { username: identity }],
      isActive: true,
    },
  });
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
    if (!checkRateLimit(`login:${ip}`, 20)) {
      return NextResponse.json({ error: "Too many incorrect attempts. Please try again later." }, { status: 429 });
    }
    return NextResponse.json({ error: "The email/username or password is incorrect." }, { status: 401 });
  }
  await createSession(user.id);
  await prisma.user.update({ where: { id: user.id }, data: { lastSeen: new Date() } });
  return NextResponse.json({ ok: true, role: user.role });
}
