import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import OrderItemModel from "./order-item.model";
import { CheckoutModel } from "./checkout.model";

@Table({
  tableName: "orders",
  timestamps: false,
})
export default class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @BelongsTo(() => CheckoutModel)
  client: CheckoutModel;

  @ForeignKey(() => CheckoutModel)
  @Column({ allowNull: false })
  clientId: string;

  @Column({ allowNull: false })
  status: string;

  @HasMany(() => OrderItemModel)
  items: OrderItemModel[];

  @Column({ allowNull: true })
  invoiceId: string;
}
