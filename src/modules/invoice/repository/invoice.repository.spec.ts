import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import InvoiceAddressModel from "./invoice-address.model";
import InvoiceItemsModel from "./invoice-items.model";
import InvoiceRepository from "./invoice.repository";
import Invoice from "../domain/invoice.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/address.value-object";
import InvoiceItems from "../domain/invoice-items.entity";

describe("InvoiceRepository unit test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      database: ":memory:",
      logging: false,
      sync: { force: true },
      models: [InvoiceModel, InvoiceAddressModel, InvoiceItemsModel],
    });

    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a one invoice", async () => {
    const repository = new InvoiceRepository();

    InvoiceModel.create({
      id: "1",
      name: "Invoice 1",
      document: "00000000000",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    InvoiceAddressModel.create({
      id: 1,
      street: "Rua X",
      state: "SP",
      city: "Guarulhos",
      zipCode: "00000-000",
      number: 10,
      complement: "Vila X",
      invoiceId: "1",
    });

    InvoiceItemsModel.create({
      id: "1",
      price: 100,
      name: "Curso Y",
      invoiceId: "1",
    });

    const invoice = await repository.find("1");

    expect(invoice).toBeDefined();
    expect(invoice.id.id).toEqual("1");
    expect(invoice.name).toEqual("Invoice 1");
    expect(invoice.document).toEqual("00000000000");
    expect(invoice.address.city).toEqual("Guarulhos");
    expect(invoice.address.complement).toEqual("Vila X");
    expect(invoice.address.number).toEqual(10);
    expect(invoice.address.state).toEqual("SP");
    expect(invoice.address.street).toEqual("Rua X");
    expect(invoice.address.zipCode).toEqual("00000-000");
    expect(invoice.items).toHaveLength(1);
  });

  it("should create a new invoice", async () => {
    const repository = new InvoiceRepository();
    const input = new Invoice({
      id: new Id("1"),
      document: "00000000000",
      name: "Invoice X",
    });
    input.changeAddress(
      new Address({
        street: "Rua X",
        state: "SP",
        city: "Guarulhos",
        zipCode: "00000-000",
        number: 10,
        complement: "Vila X",
      })
    );
    input.addItemToInvoice(
      new InvoiceItems({
        id: "1",
        name: "Curso X",
        price: 3000,
      })
    );

    const result = await repository.save(input);
    const invoiceInDb = await InvoiceModel.findOne({
      where: { id: input.id.id },
      include: [InvoiceAddressModel, InvoiceItemsModel],
    });

    expect(result).toEqual(input.id);
    expect(invoiceInDb?.id).toEqual(input.id.id);
    expect(invoiceInDb?.name).toEqual(input.name);
    expect(invoiceInDb?.document).toEqual(input.document);
    expect(invoiceInDb?.createdAt).toStrictEqual(input.createdAt);
    expect(invoiceInDb?.updatedAt).toStrictEqual(input.updatedAt);
    expect(invoiceInDb?.address.city).toEqual(input.address.city);
    expect(invoiceInDb?.address.complement).toEqual(input.address.complement);
    expect(invoiceInDb?.address.number).toEqual(input.address.number);
    expect(invoiceInDb?.address.state).toEqual(input.address.state);
    expect(invoiceInDb?.address.street).toEqual(input.address.street);
    expect(invoiceInDb?.address.zipCode).toEqual(input.address.zipCode);
    expect(invoiceInDb?.items).toHaveLength(1);
  });
});
