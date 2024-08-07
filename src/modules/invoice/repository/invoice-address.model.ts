import { Column, Model, Table } from "sequelize-typescript";

@Table({
  tableName: "invoice_address",
  timestamps: false,
})
export default class InvoiceAddressModel extends Model {
  @Column({ allowNull: false, autoIncrement: true, primaryKey: true })
  declare id: number;

  @Column({ allowNull: false })
  declare street: string;

  @Column({ allowNull: false })
  declare city: string;

  @Column({ allowNull: false })
  declare state: string;

  @Column({ field: "zip_code", allowNull: false })
  declare zipCode: string;

  @Column({ allowNull: false })
  declare complement: string;

  @Column({ allowNull: false })
  declare number: number;

  @Column({ allowNull: false, field: "invoice_id" })
  declare invoiceId: string;
}
