import { Customer } from "@data/customer";
import { StartSequelizeSession } from "@data/sequelize_session";
import { Transaction, TransactionRepo } from "@data/transaction";
import { Wallet } from "@data/wallet";
import { BusinessModelInterface } from "@logic/index";
import { CreateTransactionDto } from "@logic/transaction";
import { transactionSeeder } from "src/__tests__/samples";
import { DBSetup, SeedingError } from "src/__tests__/test_utils";

DBSetup(transactionSeeder);

const transactionRepo = new TransactionRepo();

const getAWallet = async () => {
    const wallet = await Wallet.findOne();
    if (!wallet) throw new SeedingError("wallet not found");
    return wallet;
};

const getCustomer = async (businessId: BusinessModelInterface["id"]) => {
    const customer = await Customer.findOne({ where: { businessId } });
    if (!customer) throw new SeedingError("customer not found");
    return customer;
};

describe("TESTING TRANSACTION REPO", () => {
    describe(".create", () => {
        it("should persist the transaction data and return the persisted object", async () => {
            const wallet = await getAWallet();
            const customer = await getCustomer(wallet.businessId);
            const session = await StartSequelizeSession();

            const data = new CreateTransactionDto({
                walletId: wallet.id,
                customerId: customer.id,
                businessId: wallet.businessId,
                amount: 2000,
                channel: "bank",
                charge: 200,
                chargePaidBy: "sender",
                settledAmount: 1800,
                status: "pending",
                transactionType: "credit",
                provider: "paystack",
                accountName: "Accounts don't chase",
                accountNumber: "1234567890",
                bankCode: "021",
                bankName: "People's bank",
            });

            const transaction = await transactionRepo.create(data, session);
            await session.commit();
            const persistedTransaction = await Transaction.findByPk(transaction.id);
            if (!persistedTransaction) throw new Error("Failed to persist transaction");
            expect(persistedTransaction.toJSON()).toMatchObject(data);
        });
    });
});
