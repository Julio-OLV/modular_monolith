import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import ProductCheckoutModel from "./product-checkout.model";
import CheckoutModel from "./checkout.model";

@Table({
  tableName: "checkout_product",
  timestamps: false,
})
export default class CheckoutNProductModel extends Model {
  @ForeignKey(() => CheckoutModel)
  @Column
  declare checkoutId: string;

  @ForeignKey(() => ProductCheckoutModel)
  @Column
  declare productId: string;
}
