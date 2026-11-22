import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security";

const schema = z.object({
  username: z.string().trim().regex(/^[a-zA-Z0-9_-]{3,30}$/),
  email: z.union([z.string().trim().email().max(254), z.literal("")]).optional(),
  password: z.string().min(10).max(128),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!checkRateLimit(`register:${ip}`, 5)) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Please check the registration details." }, { status: 400 });
  const email = parsed.data.email?.trim() ? parsed.data.email.trim().toLowerCase() : null;
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { username: parsed.data.username.toLowerCase() },
        ...(email ? [{ email }] : []),
      ],
    },
  });
  if (existing) return NextResponse.json({ error: "That email or username is already in use." }, { status: 409 });

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: {
      username: parsed.data.username.toLowerCase(),
      email,
      passwordHash,
      role: "USER",
    },
  });
  await createSession(user.id);
  return NextResponse.json({ ok: true }, { status: 201 });
}
