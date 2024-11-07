import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import ClientAdmFacadeFactory from "../../factory/client-adm.facade.factory";
import ListClientUseCase from "./list-client.usecase";

const client1 = {
  id: new Id("1"),
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

const client2 = {
  id: new Id("2"),
  name: "Client 2",
  email: "b@b.com",
  document: "document 2",
  address: new Address(
    "address 1",
    "address 2",
    "address 3",
    "address 4",
    "address 5",
    "address 6"
  ),
};

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([client1, client2])),
  };
};

describe("List clients Unit Test", () => {
  it("should list a client", async () => {
    const repository = MockRepository();
    const useCase = new ListClientUseCase(repository);

    const output = await useCase.execute({});

    expect(output.clients.length).toBe(2);
    expect(output.clients[0].id).toEqual(client1.id.id);
    expect(output.clients[0].name).toEqual(client1.name);
    expect(output.clients[0].email).toEqual(client1.email);
    expect(output.clients[0].address).toEqual(client1.address);
    expect(output.clients[1].id).toEqual(client2.id.id);
    expect(output.clients[1].name).toEqual(client2.name);
    expect(output.clients[1].email).toEqual(client2.email);
    expect(output.clients[1].address).toEqual(client2.address);
  });
});
