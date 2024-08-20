import Address from "../../customer/value-object/address";
import Customer from "../../customer/entity/customer";
import CustomerRepositoryInterface from "../../repository/customer-repository.interface";
import CustomerModel from "../db/sequelize/model/customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {
  async create(entity: Customer): Promise<void> {
    await CustomerModel.create({
      id: entity.id,
      name: entity.name,
      street: entity.address.street,
      number: entity.address.number,
      zipCode: entity.address.zip,
      city: entity.address.city,
      active: entity.isActive(),
      rewardPoints: entity.rewardPoints,
    });
    // throw new Error("Method not implemented.");
  }
  async update(entity: Customer): Promise<void> {
    await CustomerModel.update(
      {
        name: entity.name,
        street: entity.address.street,
        number: entity.address.number,
      },
      {
        where: {
          id: entity.id,
        },
      }
    );
    // throw new Error("Method not implemented.");
  }
  async find(id: string): Promise<Customer> {
    let customerModel;

    try {
      customerModel = await CustomerModel.findOne({
        where: {
          id,
        },
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Customer not found");
    }

    const customer = new Customer(customerModel.id, customerModel.name);
    customer.changeAddress(
      new Address(
        customerModel.street,
        customerModel.number,
        customerModel.zipCode,
        customerModel.city
      )
    );

    return customer;
    // throw new Error("Method not implemented.");
  }
  async findAll(): Promise<Customer[]> {
    const customerModels = await CustomerModel.findAll();

    return customerModels.map((customerModel) => {
      const customer = new Customer(customerModel.id, customerModel.name);
      const address = new Address(
        customerModel.street,
        customerModel.number,
        customerModel.zipCode,
        customerModel.city
      );
      customer.changeAddress(address);

      return customer;
    });
  }
}
