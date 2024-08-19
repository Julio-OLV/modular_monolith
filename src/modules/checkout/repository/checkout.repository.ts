import Order from "../domain/order.entity";
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
    throw new Error("Method not implemented.");
  }
}
