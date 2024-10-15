import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "../../domain/invoice-items.entity";
import Invoice from "../../domain/invoice.entity";
import Address from "../../value-object/address";
import FindInvoiceUseCase from "./find-invoice.usecase";

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
    generate: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
};

describe("Find all invoice use-case unit test ", () => {
  it("should find invoice", async () => {
    const invoiceRepository = MockRepository();
    const usCase = new FindInvoiceUseCase(invoiceRepository);

    const input = {
      id: "1",
    };

    const result = await usCase.execute(input);

    expect(invoiceRepository.find).toHaveBeenCalled();
    expect(result.id).toBe("1");
    expect(result.name).toBe("Invoice 1");
    expect(result.document).toBe("12345678901");
    expect(result.address.street).toBe("Street 1");
    expect(result.address.number).toBe("123");
    expect(result.address.complement).toBe("Complement 1");
    expect(result.address.city).toBe("City 1");
    expect(result.address.state).toBe("State 1");
    expect(result.address.zipCode).toBe("12345678");
    expect(result.items.length).toBe(2);
    expect(result.items[0].id).toBe("1");
    expect(result.items[0].name).toBe("Item 1");
    expect(result.items[0].price).toBe(100);
    expect(result.items[1].id).toBe("2");
    expect(result.items[1].name).toBe("Item 2");
    expect(result.items[1].price).toBe(200);
    expect(result.total).toBe(300);
    expect(result.createdAt).toBeInstanceOf(Date);
  });
});
