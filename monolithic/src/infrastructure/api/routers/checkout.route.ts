import express, { Request, Response } from "express";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../../modules/store-catalog/factory/facade.factory";
import PaymentFacadeFactory from "../../../modules/payment/factory/payment.facade.factory";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.factory";
import PlaceOrderUseCase from "../../../modules/checkout/usecase/place-order/place-order.usecase";
import OrderRepository from "../../../modules/checkout/repository/order.repository";

export const checkoutRoute = express.Router();

checkoutRoute.post("/", async (req, res) => {
  const orderRepository = new OrderRepository();
  const clientFacade = ClientAdmFacadeFactory.create();
  const productFacade = ProductAdmFacadeFactory.create();
  const storeCatalogFacade = StoreCatalogFacadeFactory.create();
  const paymentFacade = PaymentFacadeFactory.create();
  const invoiceFacade = InvoiceFacadeFactory.create();

  const useCase = new PlaceOrderUseCase(
    clientFacade,
    productFacade,
    storeCatalogFacade,
    orderRepository,
    invoiceFacade,
    paymentFacade
  );

  try {
    const inputDto = {
      clientId: req.body.clientId,
      products: req.body.products.map((product: any) => {
        return {
          productId: product.productId,
        };
      }),
    };

    const output = await useCase.execute(inputDto);
    return res.status(200).send(output);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});
