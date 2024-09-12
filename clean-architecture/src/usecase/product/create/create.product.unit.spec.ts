import ProductCreatedUseCase from "./create.product.usecase";

// const input = {
//   type: "a",
//   name: "Product 1",
//   price: 10,
// };

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit Test create product  use case", () => {
  it("should create a product A", async () => {
    const productRepository = MockRepository();
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
    const productRepository = MockRepository();
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
    const productRepository = MockRepository();
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
    const productRepository = MockRepository();
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
    const productRepository = MockRepository();
    const productCreateUseCase = new ProductCreatedUseCase(productRepository);
    const input = {
      type: "",
      name: "Product 1",
      price: 0,
    };

    await expect(productCreateUseCase.execute(input)).rejects.toThrow(
      "Product type not supported"
    );
  });
});
