import CustomerCreatedUseCase from "./create.customer.usecase";

const input = {
  name: "John Doe",
  address: {
    street: "Street",
    number: 123,
    zip: "12345-678",
    city: "City",
  },
};

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit Test create customer use case", () => {
  it("should create a customer", async () => {
    const customerRepository = MockRepository();
    const customerCreateUseCase = new CustomerCreatedUseCase(
      customerRepository
    );

    const output = await customerCreateUseCase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      address: {
        street: input.address.street,
        number: input.address.number,
        zip: input.address.zip,
        city: input.address.city,
      },
    });
  });

  it("should throw an error when name is missing", async () => {
    const customerRepository = MockRepository();
    const customerCreateUseCase = new CustomerCreatedUseCase(
      customerRepository
    );

    input.name = "";

    await expect(customerCreateUseCase.execute(input)).rejects.toThrow(
      "Name is required"
    );
  });

  it("should throw an error street is missing", async () => {
    const customerRepository = MockRepository();
    const customerCreateUseCase = new CustomerCreatedUseCase(
      customerRepository
    );

    input.address.street = "";

    await expect(customerCreateUseCase.execute(input)).rejects.toThrow(
      "Street is required"
    );
  });
});
