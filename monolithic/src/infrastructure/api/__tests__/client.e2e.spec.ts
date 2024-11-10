import { app, sequelize } from "../express";

import request from "supertest";

describe("Client tests E2E", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });
  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const response = await request(app).post("/client").send({
      name: "Client 1",
      email: "5VQ2H@example.com",
      document: "document 1",
      street: "street 1",
      number: "number 1",
      complement: "complement 1",
      city: "city 1",
      state: "state 1",
      zipCode: "zipCode 1",
    });

    expect(response.status).toBe(200);
  });
});
