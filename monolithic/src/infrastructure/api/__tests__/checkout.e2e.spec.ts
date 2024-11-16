import Address from "../../../modules/@shared/domain/value-object/address";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import { app, sequelize } from "../express";
import request from "supertest";

describe("Checkout test E2E", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a checkout ", async () => {
    const client = {
      id: "1",
      name: "Client 1",
      email: "5NjgI@example.com",
      document: "00000000000",
      address: new Address(
        "Street 1",
        "1",
        "Complement",
        "City",
        "State",
        "00000000"
      ),
    };

    const factoryClient = ClientAdmFacadeFactory.create();

    await factoryClient.add(client);

    const product1 = {
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      salesPrice: 100,
      stock: 10,
    };

    const product2 = {
      id: "2",
      name: "Product 2",
      description: "Product 2 description",
      purchasePrice: 100,
      salesPrice: 100,
      stock: 10,
    };

    const factoryProduct = ProductAdmFacadeFactory.create();

    await factoryProduct.addProduct(product1);
    await factoryProduct.addProduct(product2);

    const inputDto = {
      clientId: client.id,
      products: [
        {
          productId: product1.id,
        },
        {
          productId: product2.id,
        },
      ],
    };

    const response = await request(app).post("/checkout").send(inputDto);

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.products.length).toBe(2);
    expect(response.body.total).toBe(200);
  });
});
