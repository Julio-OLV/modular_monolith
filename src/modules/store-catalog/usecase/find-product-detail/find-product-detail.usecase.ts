import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ProductGateway from "../../gateway/product.gateway";
import {
  FindProductDetailInputDto,
  FindProductDetailOutputDto,
} from "./find-product-detail.dto";

export default class FindProductDetailUsecase implements UseCaseInterface {
  private _productRepository: ProductGateway;

  constructor(productRepository: ProductGateway) {
    this._productRepository = productRepository;
  }

  async execute(
    input: FindProductDetailInputDto
  ): Promise<FindProductDetailOutputDto> {
    const product = await this._productRepository.find(input.id);

    return {
      id: product.id.id,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
      createdAt: product.createdAt,
      updatedAt: product.createdAt,
    };
  }
}
