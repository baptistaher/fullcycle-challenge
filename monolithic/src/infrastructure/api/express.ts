import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import pinoHttp from "pino-http";
import { clientRoute } from "./routers/client.route";
import { productAdmRoute } from "./routers/product-adm.route";
import pino from "pino";
import { ClientModel } from "../client-adm/repository/sequelize/client.model";
import { ProductModel as ProductAdmModel } from "../product-adm/repository/sequelize/product.model";

export const app: Express = express();
app.use(pinoHttp());
app.use(express.json());
app.use("/client", clientRoute);
app.use("/product-adm", productAdmRoute);

export let sequelize: Sequelize;

// const logger = pino({
//   transport: {
//     target: "pino-pretty",
//     options: { colorize: true },
//   },
// });

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: true,
    // logging: (msg) => logger.info(msg), // Use a custom function to log
    // logging: false,
  });

  await sequelize.addModels([ClientModel, ProductAdmModel]);
  await sequelize.sync();
}

setupDb();
