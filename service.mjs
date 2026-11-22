// @ts-check
import nextjs from "@prisma/composer/nextjs";
import { compute } from "@prisma/composer-prisma-cloud";
import { dataContract, postgres } from "@prisma/composer-prisma-cloud/orm";
import contractJson from "./src/prisma/contract.json" with { type: "json" };

const contract = /** @type {import("./src/prisma/contract").Contract} */ (
  /** @type {unknown} */ (contractJson)
);

const service = compute({
  name: "reachout",
  deps: {
    db: postgres(dataContract(contract)),
  },
  build: nextjs({ module: import.meta.url, appDir: "." }),
});

export default service;
