import { Sequelize } from "sequelize-typescript";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/entity/customer";
import CustomerModel from "../db/sequelize/model/customer.model";
import Address from "../../domain/entity/address";

describe("Customer repository unit test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a customer", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "00000-000", "City 1");
    customer.Address = address;
    await customerRepository.create(customer);

    const customerModel = await CustomerModel.findOne({ where: { id: "123" } });

    expect(customerModel.toJSON()).toStrictEqual({
      id: "123",
      name: "Customer 1",
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
      street: address.street,
      number: address.number,
      zipCode: address.zip,
      city: address.city,
    });
  });

  it("should update a customer", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "00000-000", "City 1");
    customer.Address = address;
    await customerRepository.create(customer);
    const customerModel = await CustomerModel.findOne({ where: { id: "123" } });
    expect(customerModel.toJSON()).toStrictEqual({
      id: "123",
      name: "Customer 1",
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
      street: address.street,
      number: address.number,
      zipCode: address.zip,
      city: address.city,
    });

    customer.changeName("Customer 2");
    await customerRepository.update(customer);

    const customerModel2 = await CustomerModel.findOne({
      where: { id: "123" },
    });

    expect(customerModel2.toJSON()).toStrictEqual({
      id: "123",
      name: "Customer 2",
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
      street: address.street,
      number: address.number,
      zipCode: address.zip,
      city: address.city,
    });
  });

  it("should find a customer", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "00000-000", "City 1");
    customer.Address = address;
    await customerRepository.create(customer);

    const customerModel = await CustomerModel.findOne({ where: { id: "123" } });
    const foundCustomer = await customerRepository.find("123");
    expect(customerModel.toJSON()).toStrictEqual({
      id: foundCustomer.id,
      name: foundCustomer.name,
      active: foundCustomer.isActive(),
      street: foundCustomer.address.street,
      number: foundCustomer.address.number,
      zipCode: foundCustomer.address.zip,
      city: foundCustomer.address.city,
      rewardPoints: foundCustomer.rewardPoints,
    });
  });

  it("should find a customer", async () => {
    const customerRepository = new CustomerRepository();

    expect(async () => {
      await customerRepository.find("123AV");
    }).rejects.toThrow("Customer not found");
  });

  it("should find all customers", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "00000-000", "City 1");
    customer.Address = address;
    await customerRepository.create(customer);

    const customer2 = new Customer("456", "Customer 2");
    const address2 = new Address("Street 2", 2, "11111-111", "City 2");
    customer2.Address = address2;

    await customerRepository.create(customer2);
    const foundCustomers = await customerRepository.findAll();
    const customers = [customer, customer2];

    expect(customers).toHaveLength(2);
    expect(customers).toEqual(foundCustomers);
    expect(customers).toContainEqual(customer);
    expect(customers).toContainEqual(customer2);
  });
});
