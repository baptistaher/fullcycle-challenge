import Address from "../../../@shared/domain/value-object/address";
import AddClientUseCase from "./add-client.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe("Add Client Use-case unit test", () => {
  it("should add a client", async () => {
    const repository = MockRepository();
    const usecase = new AddClientUseCase(repository);

    const input = {
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
    };

    const result = await usecase.execute(input);
    expect(repository.add).toHaveBeenCalled();

    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.email).toEqual(input.email);
    expect(result.address).toEqual(input.address);
  });
});
