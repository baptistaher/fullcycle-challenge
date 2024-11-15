import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import pinoHttp from "pino-http";
import { Umzug } from "umzug";
import { migrator } from "../../test-migrations/config-migrations/migrator";

import ProductAdmModel from "../../modules/product-adm/repository/product.model";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { CheckoutModel } from "../../modules/checkout/repository/checkout.model";
import OrderItemModel from "../../modules/checkout/repository/order-item.model";
import OrderModel from "../../modules/checkout/repository/order.model";
import StoreCatalogProductModel from "../../modules/store-catalog/repository/product.model";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import { AddressModel } from "../../modules/invoice/repository/address.model";
import { InvoiceItemsModel } from "../../modules/invoice/repository/invoice-items.model";

import { productRoute } from "./routers/product.route";
import { clientRoute } from "./routers/client.route";
import { invoiceRoute } from "./routers/invoice.route";
import { checkoutRoute } from "./routers/checkout.route";
import { TransactionModel } from "../../modules/payment/repository/transaction.model";
import { logger } from "./server";

export const app: Express = express();
app.use(pinoHttp());
app.use(express.json());
app.use("/product", productRoute);
app.use("/client", clientRoute);
app.use("/checkout", checkoutRoute);
app.use("/invoice", invoiceRoute);

export let sequelize: Sequelize;

// let migration: Umzug<Sequelize>;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: (sql, timing) =>
      logger.info(
        sql,
        typeof timing === "number" ? `Elapsed time: ${timing}ms` : ""
      ),
  });

  sequelize.addModels([
    OrderModel,
    OrderItemModel,
    AddressModel,
    ClientModel,
    CheckoutModel,
    TransactionModel,
    InvoiceItemsModel,
    InvoiceModel,
    ProductAdmModel,
    StoreCatalogProductModel,
  ]);

  // migration = migrator(sequelize);

  // await migration.up();

  await sequelize.sync();
}

setupDb();
