import { runQuery } from "@db/postgres";
import * as dbModule from "../../../db/postgres/service";
import { PgSession } from "@db/postgres";
import { TransactionRepo } from "@wallet/data";
import {
    CreateTransactionDto,
    TransactionModelInterface,
    TransactionStatusType,
    UpdateTransactionInfoDto,
} from "@wallet/logic";
import SQL from "sql-template-strings";
import {
    getABusinessWallet,
    getACustomer,
    getATransaction,
    getAWallet,
    transactionSeeder,
} from "src/__tests__/helpers/samples";
import { DBSetup } from "src/__tests__/helpers/test_utils";
import config from "src/config";
import moment from "moment";

const pool = DBSetup(transactionSeeder);

const runQuerySpy = jest.spyOn(dbModule, "runQuery");
const transactionRepo = new TransactionRepo(pool);

const getUnsavedTransactions = async () => {
    const transaction = await getATransaction(pool);
    const transactions: CreateTransactionDto[] = [
        new CreateTransactionDto({
            amount: 1000,
            businessCharge: 100,
            businessChargePaidBy: "wallet",
            businessGot: 980,
            businessId: transaction.businessId,
            businessPaid: 20,
            bwId: transaction.bwId,
            channel: "bank",
            currency: "NGN",
            customerId: transaction.customerId,
            platformCharge: 20,
            platformChargePaidBy: "wallet",
            platformGot: 1000,
            settledAmount: 900,
            receiverPaid: 100,
            reference: "reference",
            senderPaid: 0,
            transactionType: "debit",
            provider: config.payment.currentProviders.transfer,
            providerRef: "providerRef",
            senderWalletId: transaction.senderWalletId,
            receiverWalletId: transaction.senderWalletId,
        }),
        new CreateTransactionDto({
            amount: 100,
            businessCharge: 10,
            businessChargePaidBy: "wallet",
            businessGot: 98,
            businessId: transaction.businessId,
            businessPaid: 2,
            bwId: transaction.bwId,
            channel: "bank",
            currency: "NGN",
            customerId: transaction.customerId,
            platformCharge: 2,
            platformChargePaidBy: "wallet",
            platformGot: 100,
            settledAmount: 90,
            receiverPaid: 10,
            reference: "reference2",
            senderPaid: 0,
            transactionType: "debit",
            provider: config.payment.currentProviders.transfer,
            providerRef: "providerRef2",
            senderWalletId: transaction.senderWalletId,
            receiverWalletId: transaction.senderWalletId,
        }),
    ];

    return transactions;
};

describe("TESTING TRANSACTION REPO", () => {
    describe(">>> create", () => {
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
            await session.end();

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

    describe(">>> createMultiple", () => {
        it("should persist the multiple transactions and return an array of the persisted objects", async () => {
            const transactionsData = await getUnsavedTransactions();
            const session = await transactionRepo.startSession();

            runQuerySpy.mockClear();
            const persistedTransactions = await transactionRepo.createMultiple(
                transactionsData,
                session
            );
            await session.commit();
            await session.end();

            expect(runQuerySpy).toHaveBeenCalledTimes(1);
            expect(runQuerySpy).toHaveBeenCalledWith(
                expect.anything(),
                pool,
                (session as PgSession).client
            );

            for (const transaction of persistedTransactions) {
                const data = transactionsData.find(
                    (trx) => trx.reference === transaction.reference
                );
                if (!data) throw new Error("Not properly saved");
                expect(transaction).toMatchObject(data);
            }
        });
    });

    describe(">>> getByReference", () => {
        describe("given the transaction exists", () => {
            it("should return the transaction object", async () => {
                const exTrx = await getATransaction(pool);
                const session = await transactionRepo.startSession();
                runQuerySpy.mockClear();
                const transaction = await transactionRepo.getByReference(exTrx.reference, session);
                await session.end();
                expect(transaction).toEqual(exTrx);
                expect(runQuerySpy).toHaveBeenCalledTimes(1);
                expect(runQuerySpy).toHaveBeenCalledWith(
                    expect.anything(),
                    pool,
                    (session as PgSession).client
                );
            });
        });

        describe("given the transaction does not exist", () => {
            it("should return null", async () => {
                const transaction = await transactionRepo.getByReference("nonsense");
                expect(transaction).toBeNull();
            });
        });
    });

    describe(">>> getByRefAndStatus", () => {
        describe("given the transaction exists", () => {
            it("should return the transaction object", async () => {
                const exTrx = await getATransaction(pool);
                const session = await transactionRepo.startSession();
                runQuerySpy.mockClear();
                const transaction = await transactionRepo.getByRefAndStatus(
                    exTrx.reference,
                    exTrx.status,
                    session
                );
                await session.end();
                expect(transaction).toEqual(exTrx);
                expect(runQuerySpy).toHaveBeenCalledTimes(1);
                expect(runQuerySpy).toHaveBeenCalledWith(
                    expect.anything(),
                    pool,
                    (session as PgSession).client
                );
            });
        });

        describe("given the transaction does not exist", () => {
            it("should return null", async () => {
                const exTrx = await getATransaction(pool);
                let statuses: TransactionStatusType[] = ["failed", "pending", "successful"];
                statuses = statuses.filter((st) => st !== exTrx.reference);

                const transaction = await transactionRepo.getByRefAndStatus(
                    exTrx.reference,
                    statuses[0]
                );
                expect(transaction).toBeNull();
            });
        });
    });

    describe(">>> updateReference", () => {
        it("should update the transaction record with the given reference", async () => {
            const references: TransactionModelInterface["reference"][] = [
                "dflaksdjf",
                "sdlkfj",
                "sldkfjlsd",
            ];

            const trx = await getATransaction(pool);
            for (const reference of references) {
                const session = await transactionRepo.startSession();
                await transactionRepo.updateReference(trx.id, reference, session);
                await session.commit();
                await session.end();
                const newTrx = await getATransaction(pool, trx.id);
                expect(newTrx.reference).toBe(reference);
                expect(runQuerySpy).toHaveBeenCalledWith(
                    expect.anything(),
                    expect.anything(),
                    (session as PgSession).client
                );
            }
        });
    });

    describe(">>> updateTransactionInfo", () => {
        it("should update the specified transaction with the info provided", async () => {
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
                bankName: "Second bank",
                senderWalletId: wallet.id,
                receiverPaid: 0,
                callbackUrl: null,
                provider: "aProvider",
                providerRef: "theref",
            });

            const creationData = new CreateTransactionDto({
                ...data,
                accountName: undefined,
                accountNumber: undefined,
                bankName: undefined,
                channel: null,
                providerRef: undefined,
            });

            const test = await transactionRepo.create(creationData, session);
            runQuerySpy.mockClear();
            await transactionRepo.updateTransactionInfo(
                test.id,
                new UpdateTransactionInfoDto({
                    ...data,
                    status: "successful",
                }),
                session
            );
            await session.commit();
            await session.end();

            expect(runQuerySpy).toHaveBeenCalledTimes(1);
            expect(runQuerySpy).toHaveBeenCalledWith(
                expect.anything(),
                pool,
                (session as PgSession).client
            );

            const res = await runQuery<TransactionModelInterface>(
                SQL`SELECT * FROM TRANSACTIONS WHERE "id" = ${test.id};`,
                pool
            );
            const transaction = res.rows[0];
            if (!transaction) throw new Error("Transaction not found");
            expect(transaction).toMatchObject({ ...data, status: "successful" });
        });
    });

    describe(">>> getPendingDebitThatHaveProviderRef", () => {
        it("should return an array of pending transactions that have a provider ref", async () => {
            const unsaved = await getUnsavedTransactions(); // These transactions have a provider ref

            const testTransactions = await transactionRepo.createMultiple(unsaved);

            const result = await transactionRepo.getPendingDebitThatHaveProviderRef();

            for (const transaction of result) {
                const data = testTransactions.find(
                    (trx) => trx.reference === transaction.reference
                );
                if (!data) throw new Error("Not properly saved");
                expect(data).toMatchObject(transaction);
            }
        });
    });

    describe(">>> updateForRetrial", () => {
        it("should update the status of the transaction to retrying and the retryAt to the given retrialDate", async () => {
            const transaction = await getATransaction(pool);

            const retrialDate = new Date();
            const session = await transactionRepo.startSession();
            await transactionRepo.updateForRetrial(transaction.id, retrialDate, session);
            await session.commit();
            await session.end();

            const savedTransaction = await getATransaction(pool, transaction.id);
            if (!savedTransaction) throw new Error("Did not update transaction");
            expect(savedTransaction.retryAt?.toISOString()).toBe(retrialDate.toISOString());
            expect(savedTransaction.status).toBe("retrying");
            expect(savedTransaction.retries).toBe((transaction.retries as number) + 1);
            expect(runQuerySpy).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                (session as PgSession).client
            );
        });
    });

    describe(">>> getRetryTransactions", () => {
        it("should return transactions with status retrying and retryAt is in the past", async () => {
            // Create such a transaction
            const trxs = await getUnsavedTransactions();

            const testTrxs = await transactionRepo.createMultiple(trxs);
            // Update the transactions
            const past = moment().subtract(10, "minutes");
            for (const trx of testTrxs) {
                await transactionRepo.updateForRetrial(trx.id, past.toDate());
            }

            const results = await transactionRepo.getRetryTransfers();
            for (const trx of results) {
                expect(trx.retryAt?.toISOString()).toBe(past.toISOString());
                expect(trx.status).toBe("retrying");
                expect(trx.transactionType).toBe("debit");
                const prev = testTrxs.find((tr) => tr.id === trx.id);
                expect(prev).toBeDefined();
                expect(prev).not.toBeNull();
            }
        });
    });
});
