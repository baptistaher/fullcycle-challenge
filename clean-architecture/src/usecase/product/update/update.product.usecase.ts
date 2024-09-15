import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import {
  InputUpdateProductDto,
  OutputUpdateProductDto,
} from "./update.product.dto";

export default class UpdateProductUseCase {
  private ProductRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.ProductRepository = productRepository;
  }

  async execute(input: InputUpdateProductDto): Promise<OutputUpdateProductDto> {
    const product = await this.ProductRepository.find(input.id);
    if (!product) {
      throw new Error("Product not found");
    }

    product.changeName(input.name);
    product.changePrice(input.price);

    await this.ProductRepository.update(product);
    return {
      id: product.id,
      name: product.name,
      price: product.price,
    };
  }
}
