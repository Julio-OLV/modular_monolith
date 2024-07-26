import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import ProductGateway from "../gateway/product.gateway";
import ProductModel from "./product.model";

export default class ProductRepository implements ProductGateway {
  async findAll(): Promise<Product[]> {
    const productsInDb = await ProductModel.findAll();
    return productsInDb.map(
      (product) =>
        new Product({
          id: new Id(product.dataValues.id),
          description: product.dataValues.description,
          name: product.dataValues.name,
          salesPrice: product.dataValues.salesPrice,
        })
    );
  }

  async find(id: string): Promise<Product> {
    const productInDb = await ProductModel.findOne({ where: { id } });

    if (!productInDb) {
      throw new Error(`Product not find with id ${id}`);
    }

    return new Product({
      id: new Id(productInDb.dataValues.id),
      name: productInDb.dataValues.name,
      description: productInDb.dataValues.description,
      salesPrice: productInDb.dataValues.salesPrice,
    });
  }
}
