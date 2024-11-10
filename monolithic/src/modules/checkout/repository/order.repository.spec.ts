import { Sequelize } from "sequelize-typescript";
import { CheckoutModel } from "./checkout.model";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";
import OrderRepository from "./order.repository";
import Id from "../../@shared/domain/value-object/id.value-object";
import Order from "../domain/order.entity";
import Client from "../domain/client.entity";
import Address from "../../@shared/domain/value-object/address";
import Product from "../domain/product.entity";

describe("Order Repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([OrderModel, OrderItemModel, CheckoutModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a order", async () => {
    const orderRepository = new OrderRepository();

    await CheckoutModel.create({
      id: "1",
      name: "Client 1",
      email: "email 1",
      address: "address 1",
      document: "document 1",
      street: "street 1",
      number: "number 1",
      complement: "complement 1",
      city: "city 1",
      state: "state 1",
      zipCode: "zipCode 1",
    });

    await OrderModel.create({
      id: "1",
      clientId: "1",
      status: "approved",
      invoiceId: "1",
    });

    await OrderItemModel.create({
      id: "1",
      orderId: "1",
      description: "description 1",
      salesPrice: 100,
    });

    await OrderItemModel.create({
      id: "2",
      orderId: "1",
      description: "description 2",
      salesPrice: 200,
    });

    const findOrder = await orderRepository.findOrder("1");

    expect(findOrder.id.id).toBe("1");
    expect(findOrder.client.id.id).toBe("1");
    expect(findOrder.status).toBe("approved");
    expect(findOrder.products.length).toBe(2);
    expect(findOrder.products[0].id.id).toBe("1");

    expect(findOrder.products[0].description).toBe("description 1");
    expect(findOrder.products[0].salesPrice).toBe(100);
    expect(findOrder.products[1].id.id).toBe("2");

    expect(findOrder.products[1].description).toBe("description 2");
    expect(findOrder.products[1].salesPrice).toBe(200);
    expect(findOrder.total).toBe(300);
  });

  it("should add a order", async () => {
    const orderRepository = new OrderRepository();

    await CheckoutModel.create({
      id: "1",
      name: "Client 1",
      email: "email 1",
      address: "address 1",
      document: "document 1",
      street: "street 1",
      number: "number 1",
      complement: "complement 1",
      city: "city 1",
      state: "state 1",
      zipCode: "zipCode 1",
    });

    const order = new Order({
      id: new Id("1"),
      client: new Client({
        id: new Id("1"),
        name: "Client 1",
        email: "email 1",
        document: "document 1",
        address: new Address(
          "street 1",
          "number 1",
          "complement 1",
          "city 1",
          "state 1",
          "zipCode 1"
        ),
      }),
      // clientId: "1",
      status: "approved",
      products: [
        new Product({
          id: new Id("1"),
          name: "Product 1",
          description: "Description 1",
          salesPrice: 100,
        }),
      ],
    });

    await orderRepository.addOrder(order);

    const output = await OrderModel.findOne({
      where: { id: "1" },
      include: [{ model: OrderItemModel }],
    });

    expect(output.id).toBe("1");
    expect(output.clientId).toBe("1");
    expect(output.status).toBe("approved");
    expect(output.invoiceId).toBeNull();
    expect(output.items.length).toBe(1);
    expect(output.items[0].id).toBe("1");
    expect(output.items[0].description).toBe("Description 1");
    expect(output.items[0].salesPrice).toBe(100);
  });
});
