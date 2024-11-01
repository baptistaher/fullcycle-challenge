import UseCaseInterface from "../../../@shared/use-case/use-case.interface";
import InvoiceGateway from "../../gateway/invoice.gateway";
import {
  FindInvoiceUseCaseInputDto,
  FindInvoiceUseCaseOutputDto,
} from "./find-invoice.dto";

export default class FindInvoiceUseCase implements UseCaseInterface {
  constructor(private invoiceRepository: InvoiceGateway) {}

  async execute(
    input: FindInvoiceUseCaseInputDto
  ): Promise<FindInvoiceUseCaseOutputDto> {
    const invoice = await this.invoiceRepository.find(input.id);

    return {
      id: invoice.id.id,
      name: invoice.name,
      email: invoice.email,
      document: invoice.document,
      address: {
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zip,
      },
      items: invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),

      total: invoice.total,
      createdAt: invoice.createdAt,
    };
  }
}
