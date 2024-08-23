import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import request from "supertest";
import CheckoutModel from "../../modules/checkout/repository/checkout.model";
import ProductCheckoutModel from "../../modules/checkout/repository/product-checkout.model";
import ClientCheckoutModel from "../../modules/checkout/repository/client-checkout.model";
import CheckoutNProductModel from "../../modules/checkout/repository/checkout-n-product.model";
import { migrator } from "../../infrastructure/sequelize/config-migrations/migrator";
import { app } from "../express";
import { PlaceOrderUsecaseInputDto } from "../../modules/checkout/usecase/place-order/place-order.dto";
import { AddClientInputDto } from "../../modules/client-adm/usecase/add-client/add-client.usecase.dto";
import { AddProductInputDto } from "../../modules/product-adm/usecase/add-product/add-product.dto";
import { StatusCodes } from "http-status-codes";
import ClientModel from "../../modules/client-adm/repository/client.model";
import ProductModel from "../../modules/product-adm/repository/product.model";
import StoreCatalogModel from "../../modules/store-catalog/repository/product.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";
import InvoiceModel from "../../modules/invoice/repository/invoice.model";
import InvoiceAddressModel from "../../modules/invoice/repository/invoice-address.model";
import InvoiceItemsModel from "../../modules/invoice/repository/invoice-items.model";

describe("E2E Checkout tests", () => {
  let sequelize: Sequelize;

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: false },
      models: [
        CheckoutModel,
        ProductCheckoutModel,
        ClientCheckoutModel,
        CheckoutNProductModel,
        ClientModel,
        ProductModel,
        StoreCatalogModel,
        TransactionModel,
        InvoiceModel,
        InvoiceAddressModel,
        InvoiceItemsModel,
      ],
    });

    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return;
    }
    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();
  });

  it("should create a new checkout", async () => {
    const clientResponse = await request(app)
      .post("/clients")
      .set("Accept", "application/json")
      .send({
        city: "City X",
        complement: "Complement X",
        document: "00000000000",
        email: "email@test.com",
        name: "Name X",
        number: "123",
        state: "State X",
        street: "Street X",
        zipCode: "00000000",
      } satisfies AddClientInputDto);

    const productResponse1 = await request(app)
      .post("/products")
      .set("Accept", "application/json")
      .send({
        name: "Product X",
        description: "Description of product x",
        purchasePrice: 20,
        salesPrice: 40,
        stock: 5,
      } satisfies AddProductInputDto);

    const productResponse2 = await request(app)
      .post("/products")
      .set("Accept", "application/json")
      .send({
        name: "Product Y",
        description: "Description of product y",
        purchasePrice: 200,
        salesPrice: 400,
        stock: 10,
      } satisfies AddProductInputDto);

    const result = await request(app)
      .post("/checkout")
      .set("Accept", "application/json")
      .send({
        clientId: clientResponse.body.id,
        products: [
          { productId: productResponse1.body.id },
          { productId: productResponse2.body.id },
        ],
      } satisfies PlaceOrderUsecaseInputDto);

    expect(result.statusCode).toBe(StatusCodes.CREATED);
    expect(result.body.total).toBe(440);
  });

  it("should not create a new checkout if client not found", async () => {
    const productResponse1 = await request(app)
      .post("/products")
      .set("Accept", "application/json")
      .send({
        name: "Product X",
        description: "Description of product x",
        purchasePrice: 20,
        salesPrice: 40,
        stock: 5,
      } satisfies AddProductInputDto);

    const productResponse2 = await request(app)
      .post("/products")
      .set("Accept", "application/json")
      .send({
        name: "Product Y",
        description: "Description of product y",
        purchasePrice: 200,
        salesPrice: 400,
        stock: 10,
      } satisfies AddProductInputDto);

    const result = await request(app)
      .post("/checkout")
      .set("Accept", "application/json")
      .send({
        clientId: "1",
        products: [
          { productId: productResponse1.body.id },
          { productId: productResponse2.body.id },
        ],
      } satisfies PlaceOrderUsecaseInputDto);

    expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(result.body.name).toBe("ClientNotFoundError");
  });

  it("should not create a new checkout if product not found", async () => {
    const clientResponse = await request(app)
      .post("/clients")
      .set("Accept", "application/json")
      .send({
        city: "City X",
        complement: "Complement X",
        document: "00000000000",
        email: "email@test.com",
        name: "Name X",
        number: "123",
        state: "State X",
        street: "Street X",
        zipCode: "00000000",
      } satisfies AddClientInputDto);

    const result = await request(app)
      .post("/checkout")
      .set("Accept", "application/json")
      .send({
        clientId: clientResponse.body.id,
        products: [{ productId: "1" }, { productId: "2" }],
      } satisfies PlaceOrderUsecaseInputDto);

    expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(result.body.name).toBe("ProductNotFoundError");
  });
});
