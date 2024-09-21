import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import ListCustomerUseCase from "./list.customer.usecase";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";

describe("Integration test list customer use case ", () => {
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

  it("should list all customers", async () => {
    const customerRepository = new CustomerRepository();
    const useCase = new ListCustomerUseCase(customerRepository);

    const customer1 = new Customer("123", "Customer 1");
    const address1 = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer1.changeAddress(address1);
    await customerRepository.create(customer1);

    const customer2 = new Customer("456", "Customer 2");
    const address2 = new Address("Street 2", 456, "13330-250", "São Paulo");
    customer2.changeAddress(address2);
    await customerRepository.create(customer2);

    const output = await useCase.execute({});
    expect(output.customers.length).toBe(2);
    expect(output.customers[0].id).toBe(customer1.id);
    expect(output.customers[0].name).toBe(customer1.name);
    expect(output.customers[0].address.street).toBe(address1.street);
    expect(output.customers[0].address.city).toBe(address1.city);
    expect(output.customers[0].address.number).toBe(address1.number);
    expect(output.customers[0].address.zip).toBe(address1.zip);
    expect(output.customers[1].id).toBe(customer2.id);
    expect(output.customers[1].name).toBe(customer2.name);
    expect(output.customers[1].address.street).toBe(address2.street);
    expect(output.customers[1].address.city).toBe(address2.city);
    expect(output.customers[1].address.number).toBe(address2.number);
    expect(output.customers[1].address.zip).toBe(address2.zip);
  });
});
