import {
    TransactionNotFoundError,
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
    updateReference: jest.fn(),
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

    describe(">>> getTransactionByReference", () => {
        describe("given the transaction exists", () => {
            it("should return the transaction object", async () => {
                repo.getByReference.mockResolvedValue(transactionJson);
                const transaction = await service.getTransactionByReference("someref");
                expect(transaction).toEqual(transactionJson);
                expect(repo.getByReference).toHaveBeenCalledTimes(1);
                expect(repo.getByReference).toHaveBeenCalledWith(transactionJson.reference);
            });
        });

        describe("given the transaction does not exist", () => {
            it("should throw a TransactionNotFoundError", async () => {
                repo.getByReference.mockResolvedValue(null);
                await expect(() => service.getTransactionByReference("someref")).rejects.toThrow(
                    TransactionNotFoundError
                );
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

    describe(">>> updateTransactionReference", () => {
        it("should update the transaction reference", async () => {
            repo.updateReference.mockImplementationOnce(async () => {});
            const ref = "reference";
            const id = "some";
            await service.updateTransactionReference(id, ref, sessionMock);
            expect(repo.updateReference).toHaveBeenCalledTimes(1);
            expect(repo.updateReference).toHaveBeenCalledWith(id, ref, sessionMock);
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
