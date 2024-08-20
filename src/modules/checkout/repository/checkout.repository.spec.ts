import { Sequelize } from "sequelize-typescript";
import CheckoutModel from "./checkout.model";
import ClientCheckoutModel from "./client-checkout.model";
import ProductCheckoutModel from "./product-checkout.model";
import CheckoutNProductModel from "./checkout-n-product.model";
import CheckoutRepository from "./checkout.repository";
import Order from "../domain/order.entity";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";

describe("CheckoutRepository unit tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
      models: [
        CheckoutModel,
        ClientCheckoutModel,
        ProductCheckoutModel,
        CheckoutNProductModel,
      ],
    });

    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const repository = new CheckoutRepository();

    const client = new Client({
      id: new Id("1"),
      address: "Address X",
      email: "test@email.com",
      name: "Name X",
    });

    await ClientCheckoutModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    });

    const product1 = new Product({
      id: new Id("1"),
      description: "Description X",
      name: "Name X",
      salesPrice: 100,
    });

    await ProductCheckoutModel.create({
      id: product1.id.id,
      name: product1.name,
      description: product1.description,
      salesPrice: product1.salesPrice,
      createdAt: product1.createdAt,
      updatedAt: product1.updatedAt,
    });

    const product2 = new Product({
      id: new Id("2"),
      description: "Description V",
      name: "Name V",
      salesPrice: 200,
    });

    await ProductCheckoutModel.create({
      id: product2.id.id,
      name: product2.name,
      description: product2.description,
      salesPrice: product2.salesPrice,
      createdAt: product2.createdAt,
      updatedAt: product2.updatedAt,
    });

    const order = new Order({
      id: new Id("1"),
      client,
      products: [product1, product2],
    });

    await repository.addOrder(order);

    const orderInDb = await CheckoutModel.findOne({
      where: { id: order.id.id },
      include: ["client", "products"],
    });

    expect(orderInDb).toBeDefined();
    expect(orderInDb?.dataValues.id).toBe(order.id.id);
    expect(orderInDb?.dataValues.client.id).toBe(order.client.id.id);
    expect(orderInDb?.dataValues.products).toHaveLength(2);
  });

  it("should find a order", async () => {
    const repository = new CheckoutRepository();

    const client = new Client({
      id: new Id("1"),
      address: "Address X",
      email: "test@email.com",
      name: "Name X",
    });

    await ClientCheckoutModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    });

    const product1 = new Product({
      id: new Id("1"),
      description: "Description X",
      name: "Name X",
      salesPrice: 100,
    });

    await ProductCheckoutModel.create({
      id: product1.id.id,
      name: product1.name,
      description: product1.description,
      salesPrice: product1.salesPrice,
      createdAt: product1.createdAt,
      updatedAt: product1.updatedAt,
    });

    const product2 = new Product({
      id: new Id("2"),
      description: "Description V",
      name: "Name V",
      salesPrice: 200,
    });

    await ProductCheckoutModel.create({
      id: product2.id.id,
      name: product2.name,
      description: product2.description,
      salesPrice: product2.salesPrice,
      createdAt: product2.createdAt,
      updatedAt: product2.updatedAt,
    });

    const order = new Order({
      id: new Id("1"),
      client,
      products: [product1, product2],
    });

    await repository.addOrder(order);

    const orderInDb = await repository.findOrder(order.id.id);

    expect(orderInDb).toBeDefined();
    expect(orderInDb?.id.id).toBe(order.id.id);
    expect(orderInDb?.client.id.id).toBe(order.client.id.id);
    expect(orderInDb?.products).toHaveLength(2);
  });
});
