import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import {
  PlaceOrderUsecaseInputDto,
  PlaceOrderUsecaseOutputDto,
} from "./place-order.dto";

export default class PlaceOrderUsecase implements UseCaseInterface {
  async execute(
    input: PlaceOrderUsecaseInputDto
  ): Promise<PlaceOrderUsecaseOutputDto> {
    return {
      id: "",
      products: [],
      total: 0,
    };
  }
}
