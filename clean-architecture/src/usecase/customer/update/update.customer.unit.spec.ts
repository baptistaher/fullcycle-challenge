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

const MockRepository = () => {
  return {
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(customer)),
  };
};

describe("Unit test for customer update use case", () => {
  it("should update a customer", async () => {
    const customerRepository = MockRepository();
    const customerUpdateUseCase = new UpdateCustomerUseCase(customerRepository);

    const output = await customerUpdateUseCase.execute(input);

    expect(output).toEqual(input);
  });

  it("should throw an error when customer not found", async () => {
    const customerRepository = MockRepository();
    customerRepository.find = jest.fn().mockReturnValue(Promise.resolve(null));
    const customerUpdateUseCase = new UpdateCustomerUseCase(customerRepository);

    expect(async () => {
      await customerUpdateUseCase.execute(input);
    }).rejects.toThrow("Customer not found");
  });
});
