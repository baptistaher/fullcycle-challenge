import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { checkoutRoute } from "../routers/checkout.route";
import http from "http";
import { Umzug } from "umzug";
import { CheckoutModel } from "../../../modules/checkout/repository/checkout.model";
import OrderItemModel from "../../../modules/checkout/repository/order-item.model";
import OrderModel from "../../../modules/checkout/repository/order.model";
import { migrator } from "../../../test-migrations/config-migrations/migrator";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import Address from "../../../modules/@shared/domain/value-object/address";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import request from "supertest";
import { ProductModel as ProductAdmModel } from "../../../modules/product-adm/repository/product.model";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import { ProductModel as StoreCatalogProductModel } from "../../../modules/store-catalog/repository/product.model";
import { TransactionModel } from "../../../modules/payment/repository/transaction.model";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
// import StoreCatalogFacadeFactory from "../../../modules/store-catalog/factory/facade.factory";
describe("Checkout test E2E", () => {
  const app: Express = express();

  app.use(express.json());

  app.use("/checkout", checkoutRoute);

  let server: http.Server;

  let sequelize: Sequelize;

  let migration: Umzug<any>;

  beforeEach(async () => {
    try {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
      });
      await sequelize.addModels([
        ClientModel,
        ProductAdmModel,
        StoreCatalogProductModel,
        OrderItemModel,
        OrderModel,
        CheckoutModel,
        TransactionModel,
        InvoiceModel,
      ]);
      migration = migrator(sequelize);
      await migration.up();

      server = await new Promise<http.Server>((resolve) => {
        const s = app.listen(() => resolve(s));
      });
    } catch (error) {}
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

  it("should create a checkout ", async () => {
    const client = {
      id: "1",
      name: "Client 1",
      email: "5NjgI@example.com",
      document: "00000000000",
      address: new Address(
        "Street 1",
        "1",
        "Complement",
        "City",
        "State",
        "00000000"
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
      purchasePrice: 100,
      salesPrice: 100,
      stock: 10,
    };

    const factoryProduct = ProductAdmFacadeFactory.create();

    await factoryProduct.addProduct(product1);
    await factoryProduct.addProduct(product2);

    const inputDto = {
      clientId: client.id,
      products: [
        {
          productId: product1.id,
        },
        {
          productId: product2.id,
        },
      ],
    };

    const response = await request(app).post("/checkout").send(inputDto);

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.clientId).toBe(client.id);
    expect(response.body.products.length).toBe(2);
    expect(response.body.total).toBe(200);
  });
});
