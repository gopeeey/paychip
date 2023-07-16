import {
    TransactionRepoInterface,
    TransactionService,
    TransactionServiceDependencies,
    UpdateTransactionInfoDto,
} from "@wallet/logic";
import { sessionMock } from "src/__tests__/helpers/mocks";
import { transactionData, transactionJson } from "src/__tests__/helpers/samples";

const repo: { [key in keyof TransactionRepoInterface]: jest.Mock } = {
    create: jest.fn(),
    getByReference: jest.fn(),
    startSession: jest.fn(async () => sessionMock),
    updateStatus: jest.fn(),
    updateTransactionInfo: jest.fn(),
    getByRefAndStatus: jest.fn(),
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

    describe(">>> findTransactionByRefAndStatus", () => {
        describe("given the transaction exists", () => {
            it("should return the transaction object", async () => {
                repo.getByRefAndStatus.mockResolvedValue(transactionJson);
                const transaction = await service.findTransactionByRefAndStatus(
                    transactionJson.reference,
                    transactionJson.status
                );
                expect(transaction).toEqual(transactionJson);
            });
        });

        describe("given the transaction does not exist", () => {
            it("should return null", async () => {
                repo.getByRefAndStatus.mockResolvedValue(null);
                const transaction = await service.findTransactionByRefAndStatus(
                    transactionJson.reference,
                    "successful"
                );
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

    describe(">>> updateTransactionInfo", () => {
        it("should call the updateTransactionInfo method on the repo", async () => {
            repo.updateTransactionInfo.mockImplementationOnce(async () => {});
            const info = new UpdateTransactionInfoDto({
                status: "successful",
                channel: "card",
                providerRef: "sdlkjfs",
            });
            await service.updateTransactionInfo("some", info, sessionMock);
            expect(repo.updateTransactionInfo).toHaveBeenCalledTimes(1);
            expect(repo.updateTransactionInfo).toHaveBeenCalledWith("some", info, sessionMock);
        });
    });
});