import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import { AddressModel } from "./address.model";
import { InvoiceItemsModel } from "./invoice-items.model";
import Invoice from "../domain/invoice.entity";
import Address from "../value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "../domain/invoice-items.entity";

describe("Invoice Repository test", () => {
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
    const invoiceRepository = new InvoiceRepository();

    const input = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "document 1",
      address: new Address({
        street: "street 1",
        number: "number 1",
        complement: "complement 1",
        city: "city 1",
        state: "state 1",
        zip: "zip 1",
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

    const result = await invoiceRepository.generate(input);

    expect(result.id.id).toBe("1");
    expect(result.name).toBe("Invoice 1");
    expect(result.document).toBe("document 1");
    expect(result.address.street).toBe("street 1");
    expect(result.address.number).toBe("number 1");
    expect(result.address.complement).toBe("complement 1");
    expect(result.address.city).toBe("city 1");
    expect(result.address.state).toBe("state 1");
    expect(result.address.zip).toBe("zip 1");
    expect(result.items.length).toBe(2);
    expect(result.items[0].id.id).toBe("1");
    expect(result.items[0].name).toBe("Item 1");
    expect(result.items[0].price).toBe(100);
    expect(result.items[1].id.id).toBe("2");
    expect(result.items[1].name).toBe("Item 2");
    expect(result.items[1].price).toBe(200);
    expect(result.total).toBe(300);
    expect(result.createdAt).toBeDefined();
  });

  it("should find a invoice", async () => {
    const invoiceRepository = new InvoiceRepository();

    const createDate = new Date();

    await InvoiceModel.create({
      id: "1",
      name: "Invoice 1",
      document: "document 1",
      addressId: "1",
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

    const result = await invoiceRepository.find("1");

    expect(result.id.id).toBe("1");
    expect(result.name).toBe("Invoice 1");
    expect(result.document).toBe("document 1");
    expect(result.address.street).toBe("street 1");
    expect(result.address.number).toBe("number 1");
    expect(result.address.complement).toBe("complement 1");
    expect(result.address.city).toBe("city 1");
    expect(result.address.state).toBe("state 1");
    expect(result.address.zip).toBe("zip 1");
    expect(result.items.length).toBe(2);
    expect(result.items[0].id.id).toBe("1");
    expect(result.items[0].name).toBe("Item 1");
    expect(result.items[0].price).toBe(100);
    expect(result.items[1].id.id).toBe("2");
    expect(result.items[1].name).toBe("Item 2");
    expect(result.items[1].price).toBe(200);
    expect(result.total).toBe(300);
    expect(result.createdAt).toStrictEqual(createDate);
  });
});
