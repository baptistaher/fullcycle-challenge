import StoreCatalogFacade from "../facade/store-catalog.facade";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import FindAllProductsUseCase from "../usecase/find-all-produtcs/find-all-products.usecase";
import FindProductUseCase from "../usecase/find-products/find-product.usecase";

export default class StoreCatalogFacadeFactory {
  static create(): StoreCatalogFacade {
    const productRepository = new ProductRepository();
    const findUseCase = new FindProductUseCase(productRepository);

    const findAllUseCase = new FindAllProductsUseCase(productRepository);

    const facade = new StoreCatalogFacade({
      findUseCase: findUseCase,
      findAllUseCase: findAllUseCase,
    });

    return facade;
  }
}
