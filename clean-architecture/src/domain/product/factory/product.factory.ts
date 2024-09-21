import Product from "../entity/product";
import ProductB from "../entity/product-b";
import ProductInterface from "../entity/product.interface";
import { v4 as uuid } from "uuid";

export default class ProductFactory {
  public static create(
    type: string,
    name: string,
    price: number
  ): ProductInterface {
    switch (type) {
      case "a":
        const product = new Product(uuid(), name, price);
        return product;

      case "b":
        const productB = new ProductB(uuid(), name, price);
        return productB;

      default:
        throw new Error("Product type not supported");
    }
  }
}
