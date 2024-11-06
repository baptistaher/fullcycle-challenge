import { join } from "path";
import { migrator } from "./migrator";
import pino from "pino";
// import { Sequelize } from "sequelize-typescript";
import { Sequelize } from "sequelize";

// const logger = pino({
//   transport: {
//     target: "pino-pretty",
//     options: { colorize: true },
//   },
// });

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: join(__dirname, "../../../database.sqlite"),
  logging: true,

  // logging: (msg) => logger.info(msg),
});

migrator(sequelize).runAsCLI();
