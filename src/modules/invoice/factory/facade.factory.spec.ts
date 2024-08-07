import InvoiceFacadeFactory from "./facade.factory";

describe("InvoiceFacadeFactory unit test", () => {
  it("should create a new facade", () => {
    const facade = InvoiceFacadeFactory.create();

    expect(facade).toBeDefined();
    expect(facade.find).toBeDefined();
    expect(facade.generate).toBeDefined();
  });
});
