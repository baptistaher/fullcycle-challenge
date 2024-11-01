import {
  Column,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { AddressModel } from "./address.model";
import { InvoiceItemsModel } from "./invoice-items.model";
import { DataTypes } from "sequelize";

@Table({
  tableName: "invoices",
  timestamps: false,
})
export class InvoiceModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  email: string;

  @Column({ allowNull: false })
  document: string;

  // @ForeignKey(() => AddressModel) // Explicit foreign key
  // @Column({ type: DataTypes.STRING, allowNull: false, field: "address_id" }) // Explicitly defining the type
  // addressId: string;

  @Column({ allowNull: false, field: "created_at" })
  createdAt: Date;

  @HasOne(() => AddressModel)
  address: AddressModel;

  @HasMany(() => InvoiceItemsModel)
  items: InvoiceItemsModel[];
}
