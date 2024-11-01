import { join } from "path";
import { SequelizeStorage, Umzug } from "umzug";

import { Sequelize } from "sequelize-typescript";
import pino from "pino";

export const migrator = (sequelize: Sequelize) => {
  return new Umzug({
    migrations: {
      glob: [
        "*/test-migrations/migrations/*.{js,ts}",
        {
          cwd: join(__dirname, "../../../"),
          ignore: ["**/*.d.ts", "**/index.ts", "**/index.js"],
        },
      ],
    },
    context: sequelize,
    storage: new SequelizeStorage({ sequelize }),
    logger: pino(),
  });
};
