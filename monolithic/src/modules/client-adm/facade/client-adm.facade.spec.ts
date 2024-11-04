import { Sequelize } from "sequelize-typescript";
// import { ClientModel } from "../repository/client.model";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import ClientAdmFacade from "./client-adm.facade";
// import ClientRepository from "../repository/client.repository";
import { FindClientUseCase } from "../usecase/find-client/find-client.usecase";
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factory";
import Address from "../../@shared/domain/value-object/address";
import { ClientModel } from "../../../infrastructure/client-adm/repository/sequelize/client.model";
import ClientRepository from "../../../infrastructure/client-adm/repository/sequelize/client.repository";

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
      document: "document 1",
      address: new Address(
        "address 1",
        "address 2",
        "address 3",
        "address 4",
        "address 5",
        "address 6"
      ),
    };

    await facade.add(input);

    const client = await ClientModel.findOne({ where: { id: "1" } });

    expect(client).toBeDefined();

    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.document).toBe(input.document);
    expect(client.street).toBe(input.address.street);
    expect(client.number).toBe(input.address.number);
    expect(client.complement).toBe(input.address.complement);
    expect(client.city).toBe(input.address.city);
    expect(client.state).toBe(input.address.state);
    expect(client.zipCode).toBe(input.address.zipCode);
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
      document: "document 1",
      address: new Address(
        "address 1",
        "number 1",
        "complement 3",
        "city 4",
        "state 5",
        "zipCode 6"
      ),
    };

    await facade.add(input);

    const client = await facade.find({ id: input.id });

    expect(client).toBeDefined();

    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.document).toBe(input.document);
    expect(client.address.street).toBe(input.address.street);
    expect(client.address.number).toBe(input.address.number);
    expect(client.address.complement).toBe(input.address.complement);
    expect(client.address.city).toBe(input.address.city);
    expect(client.address.state).toBe(input.address.state);
    expect(client.address.zipCode).toBe(input.address.zipCode);
  });
});
