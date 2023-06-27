import {
    TransactionRepoInterface,
    TransactionService,
    TransactionServiceDependencies,
} from "@transaction/logic";
import { sessionMock } from "src/__tests__/helpers/mocks";
import { transactionData, transactionJson } from "src/__tests__/helpers/samples";

const repo: { [key in keyof TransactionRepoInterface]: jest.Mock } = {
    create: jest.fn(),
    getByReference: jest.fn(),
    startSession: jest.fn(async () => sessionMock),
    updateStatus: jest.fn(),
};

const service = new TransactionService({ repo } as unknown as TransactionServiceDependencies);

describe("TESTING TRANSACTION SERIVCE", () => {
    describe(">>> createTransaction", () => {
        it("should return a new transaction object", async () => {
            repo.create.mockResolvedValue(transactionJson);
            const transaction = await service.createTransaction(transactionData, sessionMock);
            expect(transaction).toEqual(transactionJson);
            expect(repo.create).toHaveBeenCalledTimes(1);
            expect(repo.create).toHaveBeenCalledWith(transactionData, sessionMock);
        });
    });

    describe(">>> findTransactionByReference", () => {
        describe("given the transaction exists", () => {
            it("should return the transaction object", async () => {
                repo.getByReference.mockResolvedValue(transactionJson);
                const transaction = await service.findTransactionByReference("someref");
                expect(transaction).toEqual(transactionJson);
            });
        });

        describe("given the transaction does not exist", () => {
            it("should return null", async () => {
                repo.getByReference.mockResolvedValue(null);
                const transaction = await service.findTransactionByReference("something");
                expect(transaction).toBeNull();
            });
        });
    });

    describe(">>> updateTransactionStatus", () => {
        it("should update the transaction status", async () => {
            repo.updateStatus.mockImplementationOnce(async () => {});
            await service.updateTransactionStatus("some", "pending", sessionMock);
            expect(repo.updateStatus).toHaveBeenCalledTimes(1);
            expect(repo.updateStatus).toHaveBeenCalledWith("some", "pending", sessionMock);
        });
    });
});
