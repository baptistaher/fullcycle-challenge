import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
// import { ProductModel as ProductAdmModel } from "../../../modules/product-adm/repository/product.model";
import { migrator } from "../../../test-migrations/config-migrations/migrator";
import http from "http";
import request from "supertest";
import { productRoute } from "../routers/product.route";
import { ProductModel } from "../../../modules/product-adm/repository/product.model";

describe("Products test", () => {
  const app: Express = express();
  app.use(express.json());
  app.use("/product", productRoute);

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

      await sequelize.addModels([ProductModel]);
      migration = migrator(sequelize);
      await migration.up();

      server = await new Promise<http.Server>((resolve) => {
        const s = app.listen(() => resolve(s));
      });
      console.log("Migration Complete");
    } catch (error) {}
    // server = app.listen();
  });

  afterEach(async () => {
    if (!migration || !sequelize) return;
    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();
    // server.close();

    if (server) {
      server.close(() => {
        server.unref();
      });
    }
  });

  it("should create a product adm", async () => {
    const response = await request(app).post("/product").send({
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
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
