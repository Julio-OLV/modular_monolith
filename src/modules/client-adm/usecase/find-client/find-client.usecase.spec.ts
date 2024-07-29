import Id from "../../../@shared/domain/value-object/id.value-object";
import FindClientUsecase from "./find-client.usecase";

const clientMock = {
  id: new Id("1"),
  name: "name 1",
  email: "email@email.com",
  address: "address 1",
  updatedAt: new Date(),
  createdAt: new Date(),
};

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(clientMock)),
  };
};

describe("Find Client Usecase unit test", () => {
  it("should find a customer", async () => {
    const repository = MockRepository();
    const usecase = new FindClientUsecase(repository);

    const result = await usecase.execute({ id: "1" });

    expect(repository.find).toBeCalled();
    expect(result.id).toBe(clientMock.id.id);
    expect(result.name).toBe(clientMock.name);
    expect(result.email).toBe(clientMock.email);
    expect(result.address).toBe(clientMock.address);
    expect(result.createdAt).toBe(clientMock.createdAt);
    expect(result.updatedAt).toBe(clientMock.updatedAt);
  });
});
