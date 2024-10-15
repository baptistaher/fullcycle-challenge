import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "../../domain/invoice-items.entity";
import Invoice from "../../domain/invoice.entity";
import Address from "../../value-object/address";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const invoice = new Invoice({
  id: new Id("1"),
  name: "Invoice 1",
  document: "12345678901",
  address: new Address({
    street: "Street 1",
    number: "123",
    complement: "Complement 1",
    city: "City 1",
    state: "State 1",
    zip: "12345678",
  }),
  items: [
    new InvoiceItems({
      id: new Id("1"),
      name: "Item 1",
      price: 100,
    }),
    new InvoiceItems({
      id: new Id("2"),
      name: "Item 2",
      price: 200,
    }),
  ],
});

const MockRepository = () => {
  return {
    generate: jest.fn().mockReturnValue(invoice),
    find: jest.fn(),
  };
};

describe("Generate invoice use-case unit test", () => {
  it("should generate invoice", async () => {
    const invoiceRepository = MockRepository();
    const useCase = new GenerateInvoiceUseCase(invoiceRepository);

    const input = {
      name: "Invoice 1",
      document: "12345678901",
      street: "Street 1",
      number: "123",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "12345678",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100,
        },
        {
          id: "2",
          name: "Item 2",
          price: 200,
        },
      ],
    };

    const result = await useCase.execute(input);

    expect(invoiceRepository.generate).toHaveBeenCalled();
    expect(result.id).toBe("1");
    expect(result.name).toBe("Invoice 1");
    expect(result.document).toBe("12345678901");
    expect(result.street).toBe("Street 1");
    expect(result.number).toBe("123");
    expect(result.complement).toBe("Complement 1");
    expect(result.city).toBe("City 1");
    expect(result.state).toBe("State 1");
    expect(result.zipCode).toBe("12345678");
    expect(result.items[0].id).toBe("1");
    expect(result.items[0].name).toBe("Item 1");
    expect(result.items[0].price).toBe(100);
    expect(result.items[1].id).toBe("2");
    expect(result.items[1].name).toBe("Item 2");
    expect(result.items[1].price).toBe(200);
  });
});
