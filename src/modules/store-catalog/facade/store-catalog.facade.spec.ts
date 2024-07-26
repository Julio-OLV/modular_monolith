import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/product.model";
import StoreCatalogFacadeFactory from "../factory/facade.factory";

describe("StoreCatalogFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find all products", async () => {
    const facade = StoreCatalogFacadeFactory.create();

    await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Description product 1",
      salesPrice: 100,
    });

    await ProductModel.create({
      id: "2",
      name: "Product 2",
      description: "Description product 2",
      salesPrice: 200,
    });

    const { products } = await facade.findAll();

    expect(products).toBeDefined();
    expect(products).toHaveLength(2);

    expect(products[0].id).toBe("1");
    expect(products[0].name).toBe("Product 1");
    expect(products[0].description).toBe("Description product 1");
    expect(products[0].salesPrice).toBe(100);

    expect(products[1].id).toBe("2");
    expect(products[1].name).toBe("Product 2");
    expect(products[1].description).toBe("Description product 2");
    expect(products[1].salesPrice).toBe(200);
  });

  it("should find one product detail", async () => {
    const facade = StoreCatalogFacadeFactory.create();

    await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Description product 1",
      salesPrice: 100,
    });

    const product = await facade.find({ id: "1" });

    expect(product).toBeDefined();

    expect(product.id).toBe("1");
    expect(product.name).toBe("Product 1");
    expect(product.description).toBe("Description product 1");
    expect(product.salesPrice).toBe(100);
    expect(product.createdAt).toBeDefined();
    expect(product.updatedAt).toBeDefined();
  });
});
