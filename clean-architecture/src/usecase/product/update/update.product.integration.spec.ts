import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";
import ProductFactory from "../../../domain/product/factory/product.factory";
import Product from "../../../domain/product/entity/product";

describe("Integration test for product update use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);

    const product = ProductFactory.create("a", "Product 1", 100);

    await productRepository.create(
      new Product(product.id, product.name, product.price)
    );

    const input = {
      id: product.id,
      name: "Product 1 Updated",
      price: 200,
    };

    const output = await productUpdateUseCase.execute(input);
    expect(output).toEqual(input);
  });

  it("should throw an error when product not found", async () => {
    const productRepository = new ProductRepository();
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);
    const input = {
      id: "123",
      name: "Product 1 Updated",
      price: 200,
    };
    expect(async () => {
      await productUpdateUseCase.execute(input);
    }).rejects.toThrow("Product not found");
  });
});
