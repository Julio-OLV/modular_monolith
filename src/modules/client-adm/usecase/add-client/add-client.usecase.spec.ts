import AddClientUsecase from "./add-client.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe("Add Client Usecase unit test", () => {
  it("should add a client", async () => {
    const repository = MockRepository();
    const usecase = new AddClientUsecase(repository);

    const input = {
      name: "client 1",
      email: "x@x.com",
      document: "0000000000",
      city: "City X",
      complement: "Complement X",
      number: "10",
      state: "State X",
      street: "Street X",
      zipCode: "00000-000",
    };

    const result = await usecase.execute(input);

    expect(repository.add).toHaveBeenCalled();
    expect(result.name).toBeDefined();
    expect(result.email).toBe(input.email);
    expect(result.street).toBe(input.street);
  });
});
