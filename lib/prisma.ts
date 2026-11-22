import service from "@/service.mjs";

// The Prisma ORM 8 client comes from the app's Composer service declaration.
// `service.load()` caches its result, so calling this per request is safe,
// and it must not run at module scope: `next build` imports modules without
// the runtime environment. On Compute the database is wired by the deploy,
// so there is deliberately no DATABASE_URL fallback.
export function getPrisma() {
  return service.load().db.client;
}
