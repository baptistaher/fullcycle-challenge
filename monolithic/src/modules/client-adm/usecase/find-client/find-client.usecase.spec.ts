import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import { FindClientUseCase } from "./find-client.usecase";

const client = new Client({
  id: new Id("1"),
  name: "Client 1",
  email: "a@a.com",
  document: "document 1",
  address: new Address(
    "street 1",
    "number 1",
    "complement 3",
    "city 4",
    "state 5",
    "zipCode 6"
  ),
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(client)),
  };
};

describe("Find Client use-case unit test ", () => {
  it("should find a client", async () => {
    const repository = MockRepository();
    const useCase = new FindClientUseCase(repository);

    const input = {
      id: "1",
    };

    const result = await useCase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toEqual(input.id);
    expect(result.name).toEqual(client.name);
    expect(result.email).toEqual(client.email);
    expect(result.address).toEqual(client.address);
  });
});
