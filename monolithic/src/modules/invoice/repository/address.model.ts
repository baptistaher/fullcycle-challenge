import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";

@Table({
  tableName: "addresses",
  timestamps: false,
})
export class AddressModel extends Model {
  @Column({ allowNull: false })
  street: string;

  @Column({ allowNull: false })
  number: string;

  @Column({ allowNull: false })
  complement: string;
  @Column({ allowNull: false })
  zip: string;

  @Column({ allowNull: false })
  city: string;

  @Column({ allowNull: false })
  state: string;

  @ForeignKey(() => InvoiceModel)
  @Column({ allowNull: false })
  invoiceId: string;

  @BelongsTo(() => InvoiceModel)
  invoice: InvoiceModel;
}
