import { Sequelize } from "sequelize-typescript";
import TransactionModel from "./transaction.model";
import Transaction from "../domain/transaction.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import TransactionRepository from "./transaction.repository";

describe("TransactionRepository test", () => {
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

  it("should create a new transaction", async () => {
    const transaction = new Transaction({
      id: new Id("1"),
      amount: 100,
      orderId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    transaction.approve();
    const transactionRepository = new TransactionRepository();

    await transactionRepository.save(transaction);
    const result = await TransactionModel.findOne({
      where: { id: transaction.id.id },
    });

    expect(result?.dataValues.id).toBe(transaction.id.id);
    expect(result?.dataValues.amount).toBe(transaction.amount);
    expect(result?.dataValues.orderId).toBe(transaction.orderId);
    expect(result?.dataValues.status).toBe(transaction.status);
    expect(result?.dataValues.createdAt).toStrictEqual(transaction.createdAt);
    expect(result?.dataValues.updatedAt).toStrictEqual(transaction.updatedAt);
  });
});
