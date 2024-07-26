import StoreCatalogFacade from "../facade/store-catalog.facade";
import ProductRepository from "../repository/product.repository";
import FindAllProductsUsecase from "../usecase/find-all-products/find-all-products.usecase";
import FindProductDetailUsecase from "../usecase/find-product-detail/find-product-detail.usecase";

export default class StoreCatalogFacadeFactory {
  static create(): StoreCatalogFacade {
    const productRepository = new ProductRepository();
    const findProductDetailUsecase = new FindProductDetailUsecase(
      productRepository
    );
    const findAllProductsUsecase = new FindAllProductsUsecase(
      productRepository
    );
    const facade = new StoreCatalogFacade({
      findProductDetailUsecase,
      findAllProductsUsecase,
    });

    return facade;
  }
}
