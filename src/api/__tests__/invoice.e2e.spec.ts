import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import request from "supertest";
import CheckoutNProductModel from "../../modules/checkout/repository/checkout-n-product.model";
import CheckoutModel from "../../modules/checkout/repository/checkout.model";
import ClientCheckoutModel from "../../modules/checkout/repository/client-checkout.model";
import ProductCheckoutModel from "../../modules/checkout/repository/product-checkout.model";
import ClientModel from "../../modules/client-adm/repository/client.model";
import InvoiceAddressModel from "../../modules/invoice/repository/invoice-address.model";
import InvoiceItemsModel from "../../modules/invoice/repository/invoice-items.model";
import InvoiceModel from "../../modules/invoice/repository/invoice.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";
import ProductModel from "../../modules/product-adm/repository/product.model";
import StoreCatalogModel from "../../modules/store-catalog/repository/product.model";
import { migrator } from "../../infrastructure/sequelize/config-migrations/migrator";
import { app } from "../express";
import { PlaceOrderUsecaseInputDto } from "../../modules/checkout/usecase/place-order/place-order.dto";
import { AddClientInputDto } from "../../modules/client-adm/usecase/add-client/add-client.usecase.dto";
import { AddProductInputDto } from "../../modules/product-adm/usecase/add-product/add-product.dto";
import { StatusCodes } from "http-status-codes";

describe("E2E invoice tests", () => {
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
    if (!sequelize || !migration) {
      return;
    }
    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();
  });

  it("should find a invoice", async () => {
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

    const order = await request(app)
      .post("/checkout")
      .set("Accept", "application/json")
      .send({
        clientId: clientResponse.body.id,
        products: [
          { productId: productResponse1.body.id },
          { productId: productResponse2.body.id },
        ],
      } satisfies PlaceOrderUsecaseInputDto);

    const result = await request(app)
      .get(`/invoice/${order.body.invoiceId}`)
      .set("Accept", "application/json")
      .send();

    expect(result.statusCode).toBe(StatusCodes.OK);
    expect(result.body.id).toBe(order.body.invoiceId);
    expect(result.body.name).toBe("Name X");
    expect(result.body.document).toBe("00000000000");
    expect(result.body.address.street).toBe("Street X");
    expect(result.body.address.number).toBe(123);
    expect(result.body.address.zipCode).toBe("00000000");
    expect(result.body.items).toHaveLength(2);
    expect(result.body.total).toBe(440);
  });
});
