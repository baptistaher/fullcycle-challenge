import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import CustomerCreatedUseCase from "./create.customer.usecase";

const input = {
  name: "Customer 1",
  address: {
    street: "Street 1",
    number: 123,
    zip: "13330-250",
    city: "São Paulo",
  },
};

describe("Integration test create customer use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    await sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a customer", async () => {
    const customerRepository = new CustomerRepository();
    const customerCreateUseCase = new CustomerCreatedUseCase(
      customerRepository
    );

    const output = await customerCreateUseCase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      address: {
        street: input.address.street,
        city: input.address.city,
        number: input.address.number,
        zip: input.address.zip,
      },
    });
  });

  it("should throw an error when name is missing", async () => {
    const customerRepository = new CustomerRepository();
    const customerCreateUseCase = new CustomerCreatedUseCase(
      customerRepository
    );

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
    const customerRepository = new CustomerRepository();
    const customerCreateUseCase = new CustomerCreatedUseCase(
      customerRepository
    );

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
    const customerRepository = new CustomerRepository();
    const customerCreateUseCase = new CustomerCreatedUseCase(
      customerRepository
    );

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
