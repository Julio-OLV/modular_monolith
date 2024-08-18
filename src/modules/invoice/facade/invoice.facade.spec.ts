import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceAddressModel from "../repository/invoice-address.model";
import InvoiceItemsModel from "../repository/invoice-items.model";
import InvoiceFacadeFactory from "../factory/facade.factory";
import {
  FindInvoiceFacadeInputDto,
  GenerateInvoiceFacadeInputDto,
} from "./invoice.facade.interface";

describe("InvoiceFacade unit test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      database: ":memory:",
      dialect: "sqlite",
      logging: false,
      models: [InvoiceModel, InvoiceAddressModel, InvoiceItemsModel],
      sync: { force: true },
    });

    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate a new invoice", async () => {
    const facade = InvoiceFacadeFactory.create();
    const input: GenerateInvoiceFacadeInputDto = {
      city: "City X",
      complement: "Complement Y",
      document: "00000000000",
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 100,
        },
        {
          id: "2",
          name: "Product 2",
          price: 40,
        },
        {
          id: "3",
          name: "Product 3",
          price: 900,
        },
      ],
      name: "Name 1",
      number: "123",
      state: "State X",
      street: "Street X",
      zipCode: "00000-000",
    };

    const output = await facade.generate(input);

    expect(output).toBeDefined();
    expect(output.id).toBeDefined();
    expect(output.total).toBe(1040);
  });

  it("should find a invoice", async () => {
    const facade = InvoiceFacadeFactory.create();
    const input: FindInvoiceFacadeInputDto = {
      id: "1",
    };

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

    const output = await facade.find(input);

    expect(output).toBeDefined();
    expect(output.id).toEqual("1");
    expect(output.name).toEqual("Invoice 1");
    expect(output.document).toEqual("00000000000");
    expect(output.address.city).toEqual("Guarulhos");
    expect(output.address.complement).toEqual("Vila X");
    expect(output.address.number).toEqual(10);
    expect(output.address.state).toEqual("SP");
    expect(output.address.street).toEqual("Rua X");
    expect(output.address.zipCode).toEqual("00000-000");
    expect(output.items).toHaveLength(1);
  });
});
