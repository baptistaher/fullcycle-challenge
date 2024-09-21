import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import UpdateCustomerUseCase from "./update.customer.usecase";

const customer = CustomerFactory.createWithAddress(
  "John Doe",
  new Address("Street", 123, "12345-678", "City")
);

const input = {
  id: customer.id,
  name: "John Doe Updated",
  address: {
    street: "Street Updated",
    number: 321,
    zip: "12345-678",
    city: "City Updated",
  },
};
describe("Integration test for customer update use case", () => {
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

    const customerRepository = new CustomerRepository();
    await customerRepository.create(customer);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a customer", async () => {
    const customerRepository = new CustomerRepository();
    const customerUpdateUseCase = new UpdateCustomerUseCase(customerRepository);

    const output = await customerUpdateUseCase.execute(input);

    expect(output).toEqual(input);
  });

  it("should throw an error when customer not found", async () => {
    const customerRepository = new CustomerRepository();
    const customerUpdateUseCase = new UpdateCustomerUseCase(customerRepository);

    expect(async () => {
      await customerUpdateUseCase.execute({
        id: "non-existent-id",
        name: "John Doe Updated",
        address: {
          street: "Street Updated",
          number: 321,
          zip: "12345-678",
          city: "City Updated",
        },
      });
    }).rejects.toThrow("Customer not found");
  });
});
