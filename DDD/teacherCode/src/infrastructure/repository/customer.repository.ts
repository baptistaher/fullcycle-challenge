import Customer from "../../domain/entity/customer";
import CustomerRepositoryInterface from "../../domain/repository/customer-repository.interface";
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
  update(entity: Customer): Promise<void> {
    throw new Error("Method not implemented.");
  }
  find(id: string): Promise<Customer> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<Customer[]> {
    throw new Error("Method not implemented.");
  }
}
