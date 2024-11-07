import express, { Express } from "express";
import { productAdmRoute } from "../infrastructure/api/routers/product-adm.route";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { ProductModel as ProductAdmModel } from "../infrastructure/product-adm/repository/sequelize/product.model";
import { migrator } from "./config-migrations/migrator";
import http from "http";
import request from "supertest";

describe("Products test", () => {
  const app: Express = express();
  app.use(express.json());
  app.use("/product-adm", productAdmRoute);

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

      await sequelize.addModels([ProductAdmModel]);
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

    // if (server) {
    //   await new Promise<void>((resolve, reject) => {
    //     server.close((err) => {
    //       if (err) return reject(err);
    //       resolve();
    //     });
    //   });
    // }
  });

  it("should create a product adm", async () => {
    const response = await request(app).post("/product-adm").send({
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    });

    expect(response.status).toBe(200);
  });
});
