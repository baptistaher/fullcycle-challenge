import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/use-case/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
  private readonly _clientFacade: ClientAdmFacadeInterface;
  private readonly _productFacade: ProductAdmFacadeInterface;

  private readonly _catalogFacade: StoreCatalogFacadeInterface;
  constructor(
    clientFacade: ClientAdmFacadeInterface,
    productAdmFacade: ProductAdmFacadeInterface,
    catalogFacade: StoreCatalogFacadeInterface
  ) {
    this._clientFacade = clientFacade;
    this._productFacade = productAdmFacade;
    this._catalogFacade = catalogFacade;
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

    const products = await Promise.all(
      input.products.map((p) => this.getProduct(p.productId))
    );

    // create client object
    const myClient = new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      address: client.address,
    });

    // create order object (client, products)
    const order = new Order({
      client: myClient,
      products,
    });

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

    for (const p of input.products) {
      const product = await this._productFacade.checkStock({
        productId: p.productId,
      });

      if (product.stock === 0) {
        throw new Error(
          `Product ${product.productId} is not available in stock`
        );
      }
    }
  }

  private async getProduct(productId: string): Promise<Product> {
    const product = await this._catalogFacade.find({ id: productId });

    if (!product) {
      throw new Error("Product not found");
    }

    const productProps = {
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    };

    return new Product(productProps);
  }
}
