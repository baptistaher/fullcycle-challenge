import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  modelName: "checkout-table",
  tableName: "clients",
  timestamps: false,
})
export class CheckoutModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  email: string;

  @Column({ allowNull: false })
  document: string;

  @Column({ allowNull: false })
  street: string;

  @Column({ allowNull: false })
  number: string;

  @Column({ allowNull: false })
  complement: string;

  @Column({ allowNull: false })
  city: string;

  @Column({ allowNull: false })
  state: string;

  @Column({ allowNull: false })
  zipCode: string;

  @Column({ allowNull: true })
  createdAt: Date;

  @Column({ allowNull: true })
  updatedAt: Date;
}
