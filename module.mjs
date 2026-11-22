// @ts-check
import { module } from "@prisma/composer";
import { postgres } from "@prisma/composer-prisma-cloud/orm";
import reachoutService from "./service.mjs";

const db = postgres({
  name: "db",
  contract: reachoutService.inputs.db.required,
  config: "./prisma.config.ts",
});

export default module("reachout", ({ provision }) => {
  const dbRef = provision(db);
  provision(reachoutService, { deps: { db: dbRef } });
});
