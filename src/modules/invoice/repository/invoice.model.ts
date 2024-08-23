import { Column, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import InvoiceItemsModel from "./invoice-items.model";
import InvoiceAddressModel from "./invoice-address.model";

@Table({
  tableName: "invoices",
  timestamps: false,
})
export default class InvoiceModel extends Model {
  @Column({ allowNull: false, primaryKey: true })
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare document: string;

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;

  @HasOne(() => InvoiceAddressModel, "invoice_id")
  declare address: InvoiceAddressModel;

  @HasMany(() => InvoiceItemsModel, "invoice_id")
  declare items: InvoiceItemsModel[];
}
