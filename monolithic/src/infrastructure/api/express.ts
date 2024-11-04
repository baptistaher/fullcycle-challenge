import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import pinoHttp from "pino-http";
import { clientRoute } from "./routers/client.route";
import pino from "pino";
import { ClientModel } from "../client-adm/repository/sequelize/client.model";

export const app: Express = express();
app.use(pinoHttp());
app.use(express.json());
app.use("/client", clientRoute);

export let sequelize: Sequelize;

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: { colorize: true },
  },
});

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: (msg) => logger.info(msg), // Use a custom function to log
    // logging: false,
  });

  await sequelize.addModels([ClientModel]);
  await sequelize.sync();
}

setupDb();
