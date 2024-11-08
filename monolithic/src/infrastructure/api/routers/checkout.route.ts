import express, { Request, Response } from "express";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../../modules/store-catalog/factory/facade.factory";
import PaymentFacadeFactory from "../../../modules/payment/factory/payment.facade.factory";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.factory";
import PlaceOrderUseCase from "../../../modules/checkout/usecase/place-order/place-order.usecase";

export const checkoutRoute = express.Router();

// const facade = CheckoutFacadeFactory.create();

checkoutRoute.post("/", async (req: Request, res: Response) => {});

checkoutRoute.post("/", async (req, res) => {
  // const orderRepository = new Order();
  const clientFacade = ClientAdmFacadeFactory.create();
  const productFacade = ProductAdmFacadeFactory.create();
  const storeCatalogFacade = StoreCatalogFacadeFactory.create();
  const paymentFacade = PaymentFacadeFactory.create();
  const invoiceFacade = InvoiceFacadeFactory.create();

  const useCase = new PlaceOrderUseCase(
    clientFacade,
    productFacade,
    storeCatalogFacade
    null,
    invoiceFacade,
    paymentFacade
  );


  try {
    

    


  } catch (error) {
    return res.status(500).send(error)
  }
});
