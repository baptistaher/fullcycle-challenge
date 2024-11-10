import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import CheckStockUseCase from "./check-stock.usecase";
const product = new Product({
  id: new Id("1"),
  name: "Product 1",
  description: "Product 1 description",
  purchasePrice: 100,
  salesPrice: 59,
  stock: 10,
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
  };
};

describe("CheckStock use-case unit test", () => {
  it("should get stock of a product", async () => {
    const ProductRepository = MockRepository();
    const checkStockUsecase = new CheckStockUseCase(ProductRepository);
    const input = {
      productId: "1",
    };

    const result = await checkStockUsecase.execute(input);

    expect(ProductRepository.find).toHaveBeenCalled();
    expect(result.productId).toBe(product.id.id);
    expect(result.stock).toBe(product.stock);
  });
});
