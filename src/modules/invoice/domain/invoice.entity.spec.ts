import Address from "./address.value-object";
import InvoiceItems from "./invoice-items.entity";
import Invoice from "./invoice.entity";

describe("InvoiceEntity unit test", () => {
  it("should change a address", () => {
    const invoice = new Invoice({
      name: "Invoice 1",
      document: "00000000000",
    });

    const address = new Address({
      city: "City X",
      complement: "Complement X",
      number: 10,
      state: "State X",
      street: "Street X",
      zipCode: "00000-000",
    });

    invoice.changeAddress(address);

    expect(invoice.address).toMatchObject(address);
  });

  it("should add items on invoice", () => {
    const invoice = new Invoice({
      name: "Invoice 1",
      document: "00000000000",
    });

    const item1 = new InvoiceItems({
      id: "1",
      name: "Name 1",
      price: 100,
    });

    const item2 = new InvoiceItems({
      id: "2",
      name: "Name 2",
      price: 200,
    });

    invoice.addItemToInvoice(item1);
    invoice.addItemToInvoice(item2);

    expect(invoice.items).toHaveLength(2);
    expect(invoice.items[0]).toMatchObject(item1);
    expect(invoice.items[1]).toMatchObject(item2);
  });

  it("should return total order value", () => {
    const invoice = new Invoice({
      name: "Invoice 1",
      document: "00000000000",
    });

    const item1 = new InvoiceItems({
      id: "1",
      name: "Name 1",
      price: 100,
    });

    const item2 = new InvoiceItems({
      id: "2",
      name: "Name 2",
      price: 200,
    });

    invoice.addItemToInvoice(item1);
    invoice.addItemToInvoice(item2);

    expect(invoice.total()).toEqual(300);
  });
});
