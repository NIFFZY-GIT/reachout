CREATE TABLE "AppSetting" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "userSessionTimeoutEnabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AppSetting_pkey" PRIMARY KEY ("id")
);

INSERT INTO "AppSetting" ("id", "userSessionTimeoutEnabled")
VALUES ('global', false);

UPDATE "UserSession" AS user_session
SET "expiresAt" = CURRENT_TIMESTAMP + INTERVAL '10 years'
FROM "User" AS app_user
WHERE user_session."userId" = app_user."id"
  AND app_user."role" = 'USER'
  AND user_session."revokedAt" IS NULL
  AND user_session."expiresAt" > CURRENT_TIMESTAMP;
