import express, { Express } from "express";
import { clientRoute } from "../infrastructure/api/routers/client.route";
// import { Sequelize } from "sequelize";

import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { ClientModel } from "../infrastructure/client-adm/repository/sequelize/client.model";
import { migrator } from "./config-migrations/migrator";
import request from "supertest";

describe("Client tests", () => {
  const app: Express = express();

  app.use(express.json());
  app.use("/client", clientRoute);

  let sequelize: Sequelize;

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      // models
    });

    await sequelize.addModels([ClientModel]);
    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    if (!migration || !sequelize) return;

    migration = migrator(sequelize);
    await migration.down();
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
