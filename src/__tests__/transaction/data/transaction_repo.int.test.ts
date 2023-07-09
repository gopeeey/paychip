import { runQuery } from "@db/postgres";
import * as dbModule from "../../../db/postgres/service";
import { PgSession } from "@db/postgres";
import { TransactionRepo } from "@transaction/data";
import {
    CreateTransactionDto,
    TransactionModelInterface,
    TransactionStatusType,
    UpdateTransactionInfoDto,
} from "@transaction/logic";
import SQL from "sql-template-strings";
import {
    getABusinessWallet,
    getACustomer,
    getATransaction,
    getAWallet,
    transactionSeeder,
} from "src/__tests__/helpers/samples";
import { DBSetup } from "src/__tests__/helpers/test_utils";

const pool = DBSetup(transactionSeeder);

const runQuerySpy = jest.spyOn(dbModule, "runQuery");
const transactionRepo = new TransactionRepo(pool);

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

    describe(">>> updateStatus", () => {
        it("should update the transaction record with the given status", async () => {
            const statuses: TransactionModelInterface["status"][] = [
                "failed",
                "pending",
                "successful",
            ];

            const trx = await getATransaction(pool);
            for (const status of statuses) {
                const session = await transactionRepo.startSession();
                await transactionRepo.updateStatus(trx.id, status, session);
                await session.end();
                const newTrx = await getATransaction(pool, trx.id);
                expect(newTrx.status).toBe(status);
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
});
