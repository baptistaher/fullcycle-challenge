import Product from "../../../domain/product/entity/product";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import {
  InputCreateProductDto,
  OutputCreateProductDto,
} from "./create.product.dto";

export default class ProductCreatedUseCase {
  private productRepository: ProductRepositoryInterface;

  constructor(productRepository: ProductRepositoryInterface) {
    this.productRepository = productRepository;
  }

  async execute(input: InputCreateProductDto): Promise<OutputCreateProductDto> {
    switch (input.type) {
      case "a":
        const product = ProductFactory.create(
          input.type,
          input.name,
          input.price
        );
        const productConvert = new Product(
          product.id,
          product.name,
          product.price
        );
        await this.productRepository.create(productConvert);
        return {
          id: product.id,
          name: product.name,
          price: product.price,
        };
      case "b":
        const productB = ProductFactory.create(
          input.type,
          input.name,
          input.price
        );
        const productBConvert = new Product(
          productB.id,
          productB.name,
          productB.price
        );
        await this.productRepository.create(productBConvert);
        return {
          id: productB.id,
          name: productB.name,
          price: productB.price,
        };

      default:
        throw new Error("Product type not supported");
    }
  }
}
