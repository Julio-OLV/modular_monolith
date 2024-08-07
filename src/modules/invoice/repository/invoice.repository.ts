import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/address.value-object";
import InvoiceItems from "../domain/invoice-items.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceAddressModel from "./invoice-address.model";
import InvoiceItemsModel from "./invoice-items.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
  async find(id: string): Promise<Invoice> {
    if (!id) {
      throw new Error("Id is required");
    }

    const invoiceInDb = await InvoiceModel.findOne({
      where: { id },
      include: [InvoiceAddressModel, InvoiceItemsModel],
    });

    if (!invoiceInDb) {
      throw new Error("Invoice not found");
    }

    const invoice = new Invoice({
      id: new Id(invoiceInDb.id),
      name: invoiceInDb.name,
      document: invoiceInDb.document,
      createdAt: invoiceInDb.createdAt,
      updatedAt: invoiceInDb.updatedAt,
    });

    const address = new Address({
      city: invoiceInDb.address.city,
      complement: invoiceInDb.address.complement,
      number: invoiceInDb.address.number,
      state: invoiceInDb.address.state,
      street: invoiceInDb.address.street,
      zipCode: invoiceInDb.address.zipCode,
    });
    invoice.changeAddress(address);

    invoiceInDb.items.map((item) => {
      const invoiceItem = new InvoiceItems({
        id: item.id,
        name: item.name,
        price: item.price,
      });
      invoice.addItemToInvoice(invoiceItem);
    });

    return invoice;
  }

  async save(input: Invoice): Promise<Id> {
    await InvoiceModel.create({
      id: input.id.id,
      name: input.name,
      document: input.document,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
      items: input.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        invoiceId: input.id.id,
      })),
    });

    await InvoiceAddressModel.create({
      street: input.address.street,
      state: input.address.state,
      city: input.address.city,
      zipCode: input.address.zipCode,
      number: input.address.number,
      complement: input.address.complement,
      invoiceId: input.id.id,
    });

    for await (const item of input.items) {
      await InvoiceItemsModel.create({
        id: item.id,
        name: item.name,
        price: item.price,
        invoiceId: input.id.id,
      });
    }

    return input.id;
  }
}
