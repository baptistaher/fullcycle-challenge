import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "../domain/invoice-items.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import Address from "../value-object/address";
import { AddressModel } from "./address.model";
import { InvoiceItemsModel } from "./invoice-items.model";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: {
        id,
      },
      include: [AddressModel, InvoiceItemsModel],
    });

    if (!invoice) {
      throw new Error(`Invoice with id ${id} not found`);
    }

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      email: invoice.email,
      address: new Address(invoice.address),
      items: invoice.items.map(
        (item) =>
          new InvoiceItems({
            id: new Id(item.id),
            name: item.name,
            price: item.price,
          })
      ),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    });
  }
  async generate(input: Invoice): Promise<Invoice> {
    const newInvoice = await InvoiceModel.create({
      id: input.id.id,
      name: input.name,
      email: input.email,
      document: input.document,
      createdAt: input.createdAt,
    });

    const address = await AddressModel.create({
      invoiceId: newInvoice.id,
      street: input.address.street,
      number: input.address.number,
      complement: input.address.complement,
      city: input.address.city,
      state: input.address.state,
      zip: input.address.zip,
    });

    const items = await Promise.all(
      input.items.map((item) => {
        return InvoiceItemsModel.create({
          id: item.id.id,
          invoiceId: newInvoice.id,
          name: item.name,
          price: item.price,
        });
      })
    );

    return new Invoice({
      id: new Id(newInvoice.id),
      name: newInvoice.name,
      document: newInvoice.document,
      email: input.email,
      address: new Address(address),
      items: items.map(
        (item) =>
          new InvoiceItems({
            id: new Id(item.id),
            name: item.name,
            price: item.price,
          })
      ),
      createdAt: newInvoice.createdAt,
      updatedAt: newInvoice.updatedAt,
    });
  }
}
