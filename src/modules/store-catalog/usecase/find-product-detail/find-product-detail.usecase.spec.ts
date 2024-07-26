import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindProductDetailUsecase from "./find-product-detail.usecase";

const product = new Product({
  id: new Id("1"),
  name: "Product 1",
  description: "Description product 1",
  salesPrice: 100,
});

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
  };
};

describe("FindProductDetail usecase unit test", () => {
  it("should return detail of product", async () => {
    const productRepository = MockRepository();
    const usecase = new FindProductDetailUsecase(productRepository);
    const product = await usecase.execute({ id: "1" });

    expect(product).toBeDefined();
    expect(product.id).toBe("1");
    expect(product.name).toBe("Product 1");
    expect(product.description).toBe("Description product 1");
    expect(product.salesPrice).toBe(100);
    expect(product.createdAt).toBeDefined();
    expect(product.updatedAt).toBeDefined();
  });
});
