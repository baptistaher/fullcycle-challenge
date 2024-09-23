import CreateCustomerUseCase from "./create.customer.usecase";

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
    const customerCreateUseCase = new CreateCustomerUseCase(customerRepository);

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
    const customerCreateUseCase = new CreateCustomerUseCase(customerRepository);

    const inputMissingName = {
      name: "",
      address: {
        street: "Street 1",
        number: 123,
        zip: "13330-250",
        city: "São Paulo",
      },
    };
    await expect(
      customerCreateUseCase.execute(inputMissingName)
    ).rejects.toThrow(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({ message: "Name is required" }),
        ]),
      })
    );
  });

  it("should throw an error street is missing", async () => {
    const customerRepository = MockRepository();
    const customerCreateUseCase = new CreateCustomerUseCase(customerRepository);

    const inputMissingStreet = {
      name: "Customer 1",
      address: {
        street: "",
        number: 123,
        zip: "13330-250",
        city: "São Paulo",
      },
    };

    await expect(
      customerCreateUseCase.execute(inputMissingStreet)
    ).rejects.toThrow("Street is required");
  });

  it("should throw an error city is missing", async () => {
    const customerRepository = MockRepository();
    const customerCreateUseCase = new CreateCustomerUseCase(customerRepository);

    const inputMissingCity = {
      name: "Customer 1",
      address: {
        street: "Street 1",
        number: 123,
        zip: "13330-250",
        city: "",
      },
    };
    await expect(
      customerCreateUseCase.execute(inputMissingCity)
    ).rejects.toThrow("City is required");
  });
});
