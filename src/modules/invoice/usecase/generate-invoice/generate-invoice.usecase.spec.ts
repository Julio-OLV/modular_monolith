import Id from "../../../@shared/domain/value-object/id.value-object";
import { GenerateInvoiceInputDto } from "./generate-invoice.dto";
import GenerateInvoiceUsecase from "./generate-invoice.usecase";

const invoiceId = new Id();

const MockRepository = () => {
  return {
    find: jest.fn(),
    save: jest.fn().mockReturnValue(Promise.resolve(invoiceId)),
  };
};

describe("GenerateInvoiceUsecase unit test", () => {
  it("should generate a new invoice", async () => {
    const repository = MockRepository();
    const usecase = new GenerateInvoiceUsecase(repository);
    const input: GenerateInvoiceInputDto = {
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
      number: 123,
      state: "State X",
      street: "Street X",
      zipCode: "00000-000",
    };

    const output = await usecase.execute(input);

    expect(output).toBeDefined();
    expect(output.id).toBeDefined();
    expect(output.total).toBe(1040);
  });
});
