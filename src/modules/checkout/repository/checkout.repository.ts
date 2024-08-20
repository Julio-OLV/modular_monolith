import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import CheckoutModel from "./checkout.model";
import ProductCheckoutModel from "./product-checkout.model";

export default class CheckoutRepository implements CheckoutGateway {
  // TODO: adicionar transaction
  async addOrder(order: Order): Promise<void> {
    const result = await CheckoutModel.create({
      id: order.id.id,
      status: order.status,
      total: order.total,
      clientId: order.client.id.id,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });

    const products = [];

    // TODO: rever para modificar a promise all
    for await (const product of order.products) {
      const productInDb = await ProductCheckoutModel.findOne({
        where: { id: product.id.id },
      });

      if (!productInDb) {
        throw new Error("Product with id not found in database.");
      }

      products.push(productInDb);
    }

    await result.$set("products", [...products]);
  }

  async findOrder(id: string): Promise<Order | null> {
    const orderInDb = await CheckoutModel.findOne({
      where: { id },
      include: ["client", "products"],
    });

    return new Order({
      id: new Id(orderInDb?.dataValues.id),
      client: new Client({
        id: new Id(orderInDb?.dataValues.client.id),
        name: orderInDb?.dataValues.client.name,
        address: orderInDb?.dataValues.client.address,
        email: orderInDb?.dataValues.client.email,
      }),
      products: orderInDb?.dataValues.products.map(
        (product: any) =>
          new Product({
            id: new Id(product.id),
            description: product.description,
            name: product.name,
            salesPrice: product.salesPrice,
          })
      ),
      status: orderInDb?.dataValues.status,
    });
  }
}
