import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Address from "../../domain/address.value-object";
import InvoiceItems from "../../domain/invoice-items.entity";
import Invoice from "../../domain/invoice.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import {
  GenerateInvoiceInputDto,
  GenerateInvoiceOutputDto,
} from "./generate-invoice.dto";

export default class GenerateInvoiceUsecase implements UseCaseInterface {
  private _invoiceRepository: InvoiceGateway;

  constructor(invoiceRepository: InvoiceGateway) {
    this._invoiceRepository = invoiceRepository;
  }

  async execute(
    input: GenerateInvoiceInputDto
  ): Promise<GenerateInvoiceOutputDto> {
    const invoice = new Invoice({
      name: input.name,
      document: input.document,
    });

    const address = new Address({
      city: input.city,
      complement: input.complement,
      number: input.number,
      state: input.state,
      street: input.street,
      zipCode: input.zipCode,
    });

    input.items.map((item) => {
      invoice.addItemToInvoice(
        new InvoiceItems({ id: item.id, price: item.price, name: item.name })
      );
    });
    invoice.changeAddress(address);

    const result = await this._invoiceRepository.save(invoice);

    return {
      id: result.id,
      name: invoice.name,
      document: invoice.document,
      city: invoice.address.city,
      complement: invoice.address.complement,
      number: invoice.address.number,
      state: invoice.address.state,
      street: invoice.address.street,
      zipCode: invoice.address.zipCode,
      items: invoice.items,
      total: invoice.total(),
    };
  }
}
