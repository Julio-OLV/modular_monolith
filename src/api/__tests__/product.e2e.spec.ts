import request = require("supertest");
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { StatusCodes } from "http-status-codes";
import ProductModel from "../../modules/product-adm/repository/product.model";
import StoreCatalogModel from "../../modules/store-catalog/repository/product.model";
import { migrator } from "../../infrastructure/sequelize/config-migrations/migrator";
import { app } from "../express";
import { AddProductInputDto } from "../../modules/product-adm/usecase/add-product/add-product.dto";

describe("E2E product tests", () => {
  let sequelize: Sequelize;

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      models: [ProductModel, StoreCatalogModel],
      sync: { force: false },
    });

    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    if (!sequelize || !migration) {
      return;
    }
    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();
  });

  it("should create a new product", async () => {
    const result = await request(app)
      .post("/products")
      .set("Accept", "application/json")
      .send({
        name: "Product X",
        description: "Description of product x",
        purchasePrice: 20,
        stock: 5,
      } satisfies AddProductInputDto);

    expect(result.statusCode).toBe(StatusCodes.CREATED);
    expect(result.body.id).toBeDefined();
    expect(result.body.name).toBe("Product X");
    expect(result.body.description).toBe("Description of product x");
    expect(result.body.purchasePrice).toBe(20);
    expect(result.body.stock).toBe(5);
  });

  it("should return all products", async () => {
    await request(app)
      .post("/products")
      .set("Accept", "application/json")
      .send({
        name: "Product X",
        description: "Description of product x",
        purchasePrice: 20,
        stock: 5,
      } satisfies AddProductInputDto);
    await request(app)
      .post("/products")
      .set("Accept", "application/json")
      .send({
        name: "Product Y",
        description: "Description of product y",
        purchasePrice: 40,
        stock: 10,
      } satisfies AddProductInputDto);

    const result = await request(app)
      .get("/products")
      .set("Accept", "application/json")
      .send();

    expect(result.statusCode).toBe(StatusCodes.OK);
    expect(result.body.products).toHaveLength(2);

    const product1 = result.body.products[0];
    expect(product1.name).toBe("Product X");
    expect(product1.description).toBe("Description of product x");

    const product2 = result.body.products[1];
    expect(product2.name).toBe("Product Y");
    expect(product2.description).toBe("Description of product y");
  });
});
