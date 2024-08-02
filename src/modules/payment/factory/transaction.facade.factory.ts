import TransactionFacade from "../facade/transation.facade";
import TransactionRepository from "../repository/transaction.repository";
import ProcessPaymentUsecase from "../usecase/process-payment/process-payment.usecase";

export default class TransactionFacadeFactory {
  static create(): TransactionFacade {
    const repository = new TransactionRepository();
    const usecase = new ProcessPaymentUsecase(repository);
    const facade = new TransactionFacade(usecase);

    return facade;
  }
}
