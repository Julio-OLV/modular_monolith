import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../domain/address.value-object";
import InvoiceItems from "../../domain/invoice-items.entity";
import Invoice from "../../domain/invoice.entity";
import { FindInvoiceUseCaseInputDTO } from "./find-invoice.dto";
import FindInvoiceUsecase from "./find-invoice.usecase";

const invoice = new Invoice({
  id: new Id("1"),
  name: "Name 1",
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

const item = new InvoiceItems({
  id: "1",
  name: "Name 1",
  price: 100,
});

invoice.changeAddress(address);
invoice.addItemToInvoice(item);

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    save: jest.fn(),
  };
};

describe("FindInvoiceUsecase unit test", () => {
  it("should find a invoice", async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUsecase(repository);
    const input: FindInvoiceUseCaseInputDTO = {
      id: "1",
    };

    const output = await usecase.execute(input);

    expect(output).toBeDefined();
    expect(output.id).toEqual(invoice.id.id);
    expect(output.name).toEqual(invoice.name);
    expect(output.document).toEqual(invoice.document);
    expect(output.createdAt).toStrictEqual(invoice.createdAt);
    expect(output.total).toEqual(invoice.total());
    expect(output.address.city).toEqual(invoice.address.city);
    expect(output.address.complement).toEqual(invoice.address.complement);
    expect(output.address.number).toEqual(invoice.address.number);
    expect(output.address.state).toEqual(invoice.address.state);
    expect(output.address.street).toEqual(invoice.address.street);
    expect(output.address.zipCode).toEqual(invoice.address.zipCode);
    expect(output.items).toHaveLength(1);
  });
});
