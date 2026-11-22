import postgres from "@prisma/orm-postgres/runtime";
import { contractFromJson } from "@prisma/orm-postgres/static";
import bcrypt from "bcryptjs";
import type { Contract } from "../src/prisma/contract";
import contractJson from "../src/prisma/contract.json";

const db = postgres({
  contract: contractFromJson<Contract>(contractJson),
  url: process.env["DATABASE_URL"]!,
});

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (!email || !password) throw new Error("ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD are required");
  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await db.orm.public.User.where({ email }).first();
  if (existing) {
    await db.orm.public.User.where({ email }).update({
      role: "ADMIN",
      passwordHash,
      isActive: true,
    });
  } else {
    await db.orm.public.User.create({
      email,
      username: "reachout-admin",
      displayName: "ReachOut Support",
      passwordHash,
      role: "ADMIN",
    });
  }
}

main()
  .then(() => db.close())
  .catch(async (error) => {
    console.error(error);
    await db.close();
    process.exit(1);
  });
