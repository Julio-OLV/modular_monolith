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
    const result = await request(app)
      .post("/checkout")
      .set("Accept", "application/json")
      .send({
        clientId: "1",
        products: [{ productId: "1" }, { productId: "2" }],
      } satisfies PlaceOrderUsecaseInputDto);
  });
});
