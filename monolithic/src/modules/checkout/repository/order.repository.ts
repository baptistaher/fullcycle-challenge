import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { CheckoutModel } from "./checkout.model";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    const newOrder = await OrderModel.create({
      id: order.id.id,
      clientId: order.client.id.id,
      status: order.status,
      // invoiceId: order.invoiceId,
    });

    const orderItems = order.products.map((product) => {
      return {
        id: product.id.id,
        orderId: newOrder.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      };
    });

    await OrderItemModel.bulkCreate(orderItems);

    // throw new Error("Method not implemented.");
  }
  async findOrder(id: string): Promise<Order | null> {
    const orderModel: OrderModel = await OrderModel.findOne({
      where: {
        id,
      },
      include: [
        {
          model: CheckoutModel,
        },
        {
          model: OrderItemModel,
        },
      ],
    });

    return new Order({
      id: new Id(id),
      client: new Client({
        id: new Id(orderModel.client.id),
        name: orderModel.client.name,
        email: orderModel.client.email,
        document: orderModel.client.document,
        address: new Address(
          orderModel.client.street,
          orderModel.client.number,
          orderModel.client.complement,
          orderModel.client.city,
          orderModel.client.state,
          orderModel.client.zipCode
        ),
      }),
      status: orderModel.status,
      products: orderModel.items.map((product) => {
        return new Product({
          id: new Id(product.id),
          name: product.description,
          description: product.description,
          salesPrice: product.salesPrice,
        });
      }),
    });

    // throw new Error("Method not implemented.");
  }
}
