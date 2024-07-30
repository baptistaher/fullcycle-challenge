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
});
