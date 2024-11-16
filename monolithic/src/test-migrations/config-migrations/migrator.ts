import { join } from "path";
import { SequelizeStorage, Umzug } from "umzug";

// import { Sequelize } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { logger } from "../../infrastructure/api/express";

// const transport = pino.transport({
//   target: "pino-pretty",
//   options: { colorize: true },
// });

// export const logger = pino({
//   transport,
// });

// export const closeLogger = async () => {
//   if (transport) {
//     await transport.close();
//   }
// };

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
    logger: console,
    // logger: {
    //   info: logger.info.bind(logger),
    //   error: logger.error.bind(logger),
    //   warn: logger.warn.bind(logger),
    //   debug: logger.debug.bind(logger),
    // },
  });
};
