import express, { Express } from "express";
import { clientRoute } from "../../infrastructure/api/routers/client.route";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import http from "http";
import { migrator } from "../config-migrations/migrator";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import request from "supertest";

describe("Client Migration test", () => {
  const app: Express = express();

  app.use(express.json());
  app.use("/client", clientRoute);

  let server: http.Server;

  let sequelize: Sequelize;

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    await sequelize.addModels([ClientModel]);
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
