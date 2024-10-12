import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import ClientAdmFacade from "./client-adm.facade";
import ClientRepository from "../repository/client.repository";
import { FindClientUseCase } from "../usecase/find-client/find-client.usecase";
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factory";

describe("ClientAdmFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    // const repository = new ClientRepository();
    // const addUseCase = new AddClientUseCase(repository);

    // const facade = new ClientAdmFacade({
    //   addUseCase: addUseCase,
    //   findUseCase: undefined,
    // });

    const facade = ClientAdmFacadeFactory.create();

    const input = {
      id: "1",
      name: "Client 1",
      email: "a@a.com",
      address: "address 1",
    };

    await facade.add(input);

    const client = await ClientModel.findOne({ where: { id: "1" } });

    expect(client).toBeDefined();

    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.address).toBe(input.address);
  });

  it("should find a client", async () => {
    const repository = new ClientRepository();
    const findUseCase = new FindClientUseCase(repository);
    const addUseCase = new AddClientUseCase(repository);
    const facade = new ClientAdmFacade({
      addUseCase: addUseCase,
      findUseCase: findUseCase,
    });

    // bad practice
    const input = {
      id: "1",
      name: "Client 1",
      email: "a@a.com",
      address: "address 1",
    };

    await facade.add(input);

    const client = await facade.find({ id: input.id });

    expect(client).toBeDefined();

    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.address).toBe(input.address);
  });
});
