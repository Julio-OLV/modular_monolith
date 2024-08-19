import {
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import ClientCheckoutModel from "./client-checkout.model";
import ProductCheckoutModel from "./product-checkout.model";
import CheckoutNProductModel from "./checkout-n-product.model";

@Table({
  tableName: "checkouts",
  timestamps: false,
})
export default class CheckoutModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @ForeignKey(() => ClientCheckoutModel)
  @Column
  declare clientId: string;

  @BelongsTo(() => ClientCheckoutModel)
  declare client: ClientCheckoutModel;

  @BelongsToMany(() => ProductCheckoutModel, () => CheckoutNProductModel)
  declare products: ProductCheckoutModel[];

  @Column({ allowNull: false })
  declare status: string;

  @Column({ allowNull: false })
  declare total: number;

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;
}
