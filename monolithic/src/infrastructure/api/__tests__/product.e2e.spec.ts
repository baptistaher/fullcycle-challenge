import { app, sequelize } from "../express";
import request from "supertest";

describe("Products test E2E", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });
  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product adm", async () => {
    const response = await request(app).post("/product").send({
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      salesPrice: 100,
      stock: 10,
    });

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe("Product 1");
    expect(response.body.description).toBe("Product 1 description");
    expect(response.body.purchasePrice).toBe(100);
    expect(response.body.stock).toBe(10);
  });
});
