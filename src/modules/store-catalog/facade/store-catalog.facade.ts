import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import StoreCatalogFacadeInterface, {
  FindAllProductsFacadeOutputDto,
  FindProductDetailFacadeInputDto,
  FindProductDetailFacadeOutputDto,
} from "./store-catalog.facade.interface";

type StoreCatalogFacadeProps = {
  findProductDetailUsecase: UseCaseInterface;
  findAllProductsUsecase: UseCaseInterface;
};

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
  private _findProductDetailUsecase: UseCaseInterface;
  private _findAllProductsUsecase: UseCaseInterface;

  constructor(props: StoreCatalogFacadeProps) {
    this._findAllProductsUsecase = props.findAllProductsUsecase;
    this._findProductDetailUsecase = props.findProductDetailUsecase;
  }

  async find(
    input: FindProductDetailFacadeInputDto
  ): Promise<FindProductDetailFacadeOutputDto> {
    return await this._findProductDetailUsecase.execute(input);
  }

  async findAll(): Promise<FindAllProductsFacadeOutputDto> {
    return await this._findAllProductsUsecase.execute();
  }
}
