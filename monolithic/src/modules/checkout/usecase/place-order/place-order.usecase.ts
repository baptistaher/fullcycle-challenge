import UseCaseInterface from "../../../@shared/use-case/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
  private readonly _clientFacade: ClientAdmFacadeInterface;
  constructor(clientFacade: ClientAdmFacadeInterface) {
    this._clientFacade = clientFacade;
  }
  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    // get the client. Case not found -> client not found
    const client = await this._clientFacade.find({ id: input.clientId });

    if (!client) {
      throw new Error("Client not found");
    }

    // validate product
    await this.validateProducts(input);
    // retrieve products

    // create client object
    // create order object (client, products)

    // processpayment -> paymentFacade.process (orderId, amount)

    // case payment is approved -> Generate invoice
    // change order status to approved
    // return dto

    return {
      id: "",
      invoiceId: "",
      status: "",
      total: 0,
      products: [],
    };
  }

  private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
    if (input.products.length === 0) {
      throw new Error("No products selected");
    }
  }
}
