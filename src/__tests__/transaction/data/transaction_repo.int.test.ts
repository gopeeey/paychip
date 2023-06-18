import { runQuery } from "@db/postgres";
import * as dbModule from "@db/postgres";
import { PgSession } from "@db/postgres";
import { TransactionRepo } from "@transaction/data";
import { CreateTransactionDto, TransactionModelInterface } from "@transaction/logic";
import SQL from "sql-template-strings";
import {
    getABusinessWallet,
    getACustomer,
    getAWallet,
    transactionSeeder,
} from "src/__tests__/helpers/samples";
import { DBSetup } from "src/__tests__/helpers/test_utils";

const pool = DBSetup(transactionSeeder);

const runQuerySpy = jest.spyOn(dbModule, "runQuery");
const transactionRepo = new TransactionRepo(pool);

describe("TESTING TRANSACTION REPO", () => {
    describe(".create", () => {
        it("should persist the transaction data and return the persisted object", async () => {
            const wallet = await getAWallet(pool);
            const customer = await getACustomer(pool, wallet.businessId);
            const businessWallet = await getABusinessWallet(pool);
            const session = await transactionRepo.startSession();

            const data = new CreateTransactionDto({
                amount: 2000,
                businessCharge: 20,
                businessChargePaidBy: "wallet",
                businessGot: 1900,
                businessId: wallet.businessId,
                businessPaid: 80,
                bwId: businessWallet.id,
                channel: "bank",
                currency: "NGN",
                customerId: customer.id,
                platformCharge: 20,
                platformChargePaidBy: "wallet",
                platformGot: 2000,
                senderPaid: 2000,
                settledAmount: 1900,
                transactionType: "credit",
                reference: "thisIsAReference",
                accountName: "The one with no name",
                accountNumber: "1234355678990",
                bankCode: "035",
                bankName: "Second bank",
                senderWalletId: wallet.id,
                receiverPaid: 0,
                callbackUrl: null,
            });

            runQuerySpy.mockClear();
            const transaction = await transactionRepo.create(data, session);
            await session.commit();

            expect(runQuerySpy).toHaveBeenCalledTimes(1);
            expect(runQuerySpy).toHaveBeenCalledWith(
                expect.anything(),
                pool,
                (session as PgSession).client
            );

            const res = await runQuery<TransactionModelInterface>(
                SQL`SELECT * FROM "transactions" WHERE "id" = ${transaction.id}`,
                pool
            );

            const persistedTransaction = res.rows[0];
            if (!persistedTransaction) throw new Error("Failed to persist transaction");
            expect(persistedTransaction).toMatchObject(data);
        });
    });
});