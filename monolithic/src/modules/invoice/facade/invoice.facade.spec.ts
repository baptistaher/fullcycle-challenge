import { Sequelize } from "sequelize-typescript";
import InvoiceFacadeFactory from "../factory/invoice.factory";
import { InvoiceModel } from "../repository/invoice.model";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../use-case/find-invoice/find-invoice.usecase";
import InvoiceFacade from "./invoice.facade";
import { AddressModel } from "../repository/address.model";
import { InvoiceItemsModel } from "../repository/invoice-items.model";

describe("InvoiceFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    await sequelize.addModels([InvoiceModel, AddressModel, InvoiceItemsModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const input = {
      name: "Invoice 1",
      document: "12345678901",
      email: "Email 1",
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

    const result = await facade.generate(input);

    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.email).toBe(input.email);
    expect(result.city).toBe(input.city);
    expect(result.document).toBe(input.document);
    expect(result.street).toBe(input.street);
    expect(result.number).toBe(input.number);
    expect(result.state).toBe(input.state);
    expect(result.zipCode).toBe(input.zipCode);
    expect(result.items.length).toBe(2);
    expect(result.items[0].id).toBe("1");
    expect(result.items[0].name).toBe("Item 1");
    expect(result.items[0].price).toBe(100);
    expect(result.items[1].id).toBe("2");
    expect(result.items[1].name).toBe("Item 2");
    expect(result.items[1].price).toBe(200);
    expect(result.total).toBe(300);
  });

  it("should find a invoice", async () => {
    // const repository = new InvoiceRepository();
    // const useCase = new FindInvoiceUseCase(repository);
    // const facade = new InvoiceFacade({
    //   findUseCase: useCase,
    // });

    const facade = InvoiceFacadeFactory.create();
    const createDate = new Date();

    await InvoiceModel.create({
      id: "1",
      name: "Invoice 1",
      email: "Email 1",
      document: "document 1",
      items: "items 1",
      createdAt: createDate,
      updatedAt: createDate,
    });

    await AddressModel.create({
      id: "1",
      invoiceId: "1",
      street: "street 1",
      number: "number 1",
      complement: "complement 1",
      city: "city 1",
      state: "state 1",
      zip: "zip 1",
    });

    await InvoiceItemsModel.create({
      id: "1",
      invoiceId: "1",
      name: "Item 1",
      price: 100,
    });

    await InvoiceItemsModel.create({
      id: "2",
      invoiceId: "1",
      name: "Item 2",
      price: 200,
    });

    const result = await facade.find({ id: "1" });

    expect(result.id).toBe("1");
    expect(result.name).toBe("Invoice 1");
    expect(result.email).toBe("Email 1");
    expect(result.document).toBe("document 1");
    expect(result.address.street).toBe("street 1");
    expect(result.address.number).toBe("number 1");
    expect(result.address.complement).toBe("complement 1");
    expect(result.address.city).toBe("city 1");
    expect(result.address.state).toBe("state 1");
    expect(result.address.zipCode).toBe("zip 1");
    expect(result.items.length).toBe(2);
    expect(result.items[0].id).toBe("1");
    expect(result.items[0].name).toBe("Item 1");
    expect(result.items[0].price).toBe(100);
    expect(result.items[1].id).toBe("2");
    expect(result.items[1].name).toBe("Item 2");
    expect(result.items[1].price).toBe(200);
    expect(result.total).toBe(300);
    expect(result.createdAt).toStrictEqual(createDate);
  });
});
