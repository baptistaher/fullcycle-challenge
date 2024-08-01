import Order from "../../domain/entity/order";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [
          {
            model: OrderItemModel,
          },
        ],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const existingOrder = await OrderModel.findByPk(entity.id, {
      include: ["items"],
    });

    if (!existingOrder) {
      throw new Error("Order not found");
    }

    await existingOrder.update({
      customer_id: entity.customerId,
      total: entity.total(),
    });

    for (const item of entity.items) {
      const existingItem = existingOrder.items.find((i) => i.id === item.id);

      if (existingItem) {
        await existingItem.update({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          product_id: item.productId,
        });
      } else {
        await OrderItemModel.create({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          order_id: entity.id,
          product_id: item.productId,
        });
      }
    }

    await existingOrder.save();
  }
  find(id: string): Promise<Order> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<Order[]> {
    throw new Error("Method not implemented.");
  }
}
