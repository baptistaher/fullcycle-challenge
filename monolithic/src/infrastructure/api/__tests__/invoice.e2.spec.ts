import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.factory";
import { app, sequelize } from "../express";

import request from "supertest";

describe("Invoice test E2E", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await sequelize.close();
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
