import express, { Express } from "express";
import { checkoutRoute } from "../../infrastructure/api/routers/checkout.route";
import request from "supertest";
import http from "http";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { migrator } from "../config-migrations/migrator";
import OrderModel from "../../modules/checkout/repository/order.model";
import OrderItemModel from "../../modules/checkout/repository/order-item.model";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { CheckoutModel } from "../../modules/checkout/repository/checkout.model";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import { TransactionModel } from "../../modules/payment/repository/transaction.model";
import { InvoiceItemsModel } from "../../modules/invoice/repository/invoice-items.model";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import { ProductModel as StoreCatalogProductModel } from "../../modules/store-catalog/repository/product.model";
import ClientAdmFacadeFactory from "../../modules/client-adm/factory/client-adm.facade.factory";
import Address from "../../modules/@shared/domain/value-object/address";
import ProductAdmFacadeFactory from "../../modules/product-adm/factory/facade.factory";
import { AddressModel } from "../../modules/invoice/repository/address.model";

describe("Checkout Migration test", () => {
  const app: Express = express();

  app.use(express.json());
  app.use("/checkout", checkoutRoute);

  let server: http.Server;

  let sequelize: Sequelize;

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    await sequelize.addModels([
      OrderModel,
      OrderItemModel,
      AddressModel,
      ClientModel,
      CheckoutModel,
      ProductModel,
      TransactionModel,
      InvoiceItemsModel,
      InvoiceModel,
      StoreCatalogProductModel,
    ]);
    migration = migrator(sequelize);
    await migration.up();

    server = await new Promise<http.Server>((resolve) => {
      const s = app.listen(() => resolve(s));
    });
  });

  afterEach(async () => {
    if (!migration || !sequelize) return;

    migration = migrator(sequelize);
    await migration.down();

    await sequelize.close();

    if (server) {
      server.close(() => {
        server.unref();
      });
    }
  });

  it("should create a checkout", async () => {
    const client = {
      id: "1",
      name: "Client 1",
      email: "5VQ2H@example.com",
      document: "document 1",
      address: new Address(
        "street 1",
        "number 1",
        "complement 1",
        "city 1",
        "state 1",
        "zipCode 1"
      ),
    };

    const factoryClient = ClientAdmFacadeFactory.create();
    await factoryClient.add(client);

    const product1 = {
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      salesPrice: 100,
      stock: 10,
    };

    const product2 = {
      id: "2",
      name: "Product 2",
      description: "Product 2 description",
      purchasePrice: 200,
      salesPrice: 200,
      stock: 20,
    };

    const factoryProduct = ProductAdmFacadeFactory.create();
    await factoryProduct.addProduct(product1);
    await factoryProduct.addProduct(product2);

    const response = await request(app)
      .post("/checkout")
      .send({
        clientId: "1",
        products: [
          {
            productId: "1",
          },
        ],
      });
    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.total).toBe(100);
    expect(response.body.status).toBe("approved");
  });
});
