import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  isSessionTimeoutSettingsTableMissing,
  requireAuth,
  SESSION_TTL_MS,
  SESSION_UNTIMED_TTL_MS,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  enabled: z.boolean(),
});

function migrationRequired() {
  return NextResponse.json(
    { error: "Apply the session-timeout database migration before changing this setting." },
    { status: 503 },
  );
}

export async function GET() {
  const session = await requireAuth("ADMIN");
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const settings = await prisma.appSetting.findUnique({
      where: { id: "global" },
      select: { userSessionTimeoutEnabled: true },
    });
    return NextResponse.json({
      enabled: settings?.userSessionTimeoutEnabled ?? false,
    });
  } catch (error) {
    if (!isSessionTimeoutSettingsTableMissing(error)) throw error;
    console.error("Session-timeout setting is unavailable until its migration is applied.", error);
    return migrationRequired();
  }
}

export async function PATCH(request: NextRequest) {
  const session = await requireAuth("ADMIN");
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid timeout setting." }, { status: 400 });
  }

  const now = new Date();
  const expiresAt = new Date(
    now.getTime() +
      (parsed.data.enabled ? SESSION_TTL_MS : SESSION_UNTIMED_TTL_MS),
  );
  try {
    await prisma.$transaction(async (tx) => {
      await tx.appSetting.upsert({
        where: { id: "global" },
        create: {
          id: "global",
          userSessionTimeoutEnabled: parsed.data.enabled,
        },
        update: { userSessionTimeoutEnabled: parsed.data.enabled },
      });
      await tx.userSession.updateMany({
        where: {
          revokedAt: null,
          expiresAt: { gt: now },
          user: { is: { role: "USER" } },
        },
        data: { expiresAt },
      });
    });
  } catch (error) {
    if (!isSessionTimeoutSettingsTableMissing(error)) throw error;
    console.error("Session-timeout setting is unavailable until its migration is applied.", error);
    return migrationRequired();
  }

  return NextResponse.json({ enabled: parsed.data.enabled });
}
