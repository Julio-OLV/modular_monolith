import { Column, Model, Table } from "sequelize-typescript";

@Table({
  tableName: "invoice_items",
  timestamps: false,
})
export default class InvoiceItemsModel extends Model {
  @Column({ allowNull: false, primaryKey: true })
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare price: number;

  @Column({ allowNull: false, field: "invoice_id" })
  declare invoiceId: string;
}
