import InvoiceFacade, { InvoiceFacadeProps } from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUsecase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUsecase from "../usecase/generate-invoice/generate-invoice.usecase";

export default class InvoiceFacadeFactory {
  static create(): InvoiceFacade {
    const repository = new InvoiceRepository();
    const generateInvoiceUsecase = new GenerateInvoiceUsecase(repository);
    const findInvoiceUsecase = new FindInvoiceUsecase(repository);
    const usecases: InvoiceFacadeProps = {
      generateInvoiceUsecase,
      findInvoiceUsecase,
    };

    const facade = new InvoiceFacade(usecases);

    return facade;
  }
}
