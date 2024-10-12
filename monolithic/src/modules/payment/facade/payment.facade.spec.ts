import { Sequelize } from "sequelize-typescript";
import { TransactionModel } from "../repository/transaction.model";
import TransactionRepository from "../repository/transaction.repository";
import ProcessPaymentUseCase from "../usecase/process-payment/process-payment.usecase";
import PaymentFacade from "./payment.facade";
import PaymentFacadeFactory from "../factory/payment.facade.factory";

describe("PaymentFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([TransactionModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a transaction", async () => {
    // const repository = new TransactionRepository();
    // const useCase = new ProcessPaymentUseCase(repository);
    // const facade = new PaymentFacade(useCase);

    const facade = PaymentFacadeFactory.create();
    const input = {
      orderId: "order-1",
      amount: 100,
    };

    const result = await facade.process(input);

    expect(result.transactionId).toBeDefined();
    expect(result.status).toBe("approved");
    expect(result.amount).toBe(input.amount);
    expect(result.orderId).toBe(input.orderId);
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });
});
