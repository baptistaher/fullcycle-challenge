import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import http from "http";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import { InvoiceItemsModel } from "../../modules/invoice/repository/invoice-items.model";
import { migrator } from "../config-migrations/migrator";
import request from "supertest";
import InvoiceFacadeFactory from "../../modules/invoice/factory/invoice.factory";
import { invoiceRoute } from "../../infrastructure/api/routers/invoice.route";
import { AddressModel } from "../../modules/invoice/repository/address.model";

describe("Invoice Migration Test", () => {
  const app: Express = express();

  app.use(express.json());
  app.use("/invoice", invoiceRoute);

  let server: http.Server;

  let sequelize: Sequelize;

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemsModel, AddressModel]);
    await sequelize.sync({ force: true });
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
      server.close();
    }
  });

  it("should find a invoice", async () => {
    const input = {
      name: "Invoice 1",
      email: "a@a.com",
      document: "document 1",
      street: "street 1",
      number: "number 1",
      complement: "complement 1",
      city: "city 1",
      state: "state 1",
      zipCode: "zipCode 1",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100,
        },
        {
          id: "2",
          name: "Item 2",
          price: 200,
        },
      ],
    };

    const invoiceFacade = InvoiceFacadeFactory.create();
    const output = await invoiceFacade.generate(input);

    const response = await request(app).get(`/invoice/${output.id}`);

    console.log(output);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(output.id);
    expect(response.body.name).toBe(output.name);
    expect(response.body.document).toBe(output.document);
    expect(response.body.address.street).toBe(output.street);
    expect(response.body.address.number).toBe(output.number);
    expect(response.body.address.complement).toBe(output.complement);
    expect(response.body.address.city).toBe(output.city);
    expect(response.body.address.state).toBe(output.state);
    expect(response.body.address.zipCode).toBe(output.zipCode);
    expect(response.body.total).toBe(output.total);
  });
});
