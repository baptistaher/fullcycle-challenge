import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductCreatedUseCase from "./create.product.usecase";

describe("Integration test create a product use case", () => {
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

  it("should create a product A", async () => {
    const productRepository = new ProductRepository();

    const productCreateUseCase = new ProductCreatedUseCase(productRepository);

    const input = {
      type: "a",
      name: "Product 1",
      price: 10,
    };
    const output = await productCreateUseCase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    });
  });

  it("should create a product B", async () => {
    const productRepository = new ProductRepository();
    const productCreateUseCase = new ProductCreatedUseCase(productRepository);
    const input = {
      type: "b",
      name: "Product 1",
      price: 10,
    };

    const output = await productCreateUseCase.execute(input);
    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price * 2,
    });
  });

  it("should throw an error when name is missing", async () => {
    const productRepository = new ProductRepository();
    const productCreateUseCase = new ProductCreatedUseCase(productRepository);
    const input = {
      type: "a",
      name: "",
      price: 10,
    };
    await expect(productCreateUseCase.execute(input)).rejects.toThrow(
      "Name is required"
    );
  });

  it("should throw an error when price is less than zero", async () => {
    const productRepository = new ProductRepository();
    const productCreateUseCase = new ProductCreatedUseCase(productRepository);
    const input = {
      type: "a",
      name: "Product 1",
      price: -1,
    };
    await expect(productCreateUseCase.execute(input)).rejects.toThrow(
      "Price must be greater than 0"
    );
  });

  it("should throw an error when type is missing", async () => {
    const productRepository = new ProductRepository();
    const productCreateUseCase = new ProductCreatedUseCase(productRepository);
    const input = {
      type: "",
      name: "Product 1",
      price: 10,
    };
    await expect(productCreateUseCase.execute(input)).rejects.toThrow(
      "Product type not supported"
    );
  });
});
