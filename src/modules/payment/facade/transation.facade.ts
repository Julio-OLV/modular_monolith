import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import TransactionFacadeInterface, {
  TransactionFacadeInputDto,
  TransactionFacadeOutputDto,
} from "./transaction.facade.interface";

export default class TransactionFacade implements TransactionFacadeInterface {
  private _processPayementUseCase: UseCaseInterface;

  constructor(processPaymnentUseCase: UseCaseInterface) {
    this._processPayementUseCase = processPaymnentUseCase;
  }

  async process(
    input: TransactionFacadeInputDto
  ): Promise<TransactionFacadeOutputDto> {
    const result = await this._processPayementUseCase.execute(input);

    return {
      transactionId: result.transactionId,
      orderId: result.orderId,
      amount: result.amount,
      status: result.status,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}
