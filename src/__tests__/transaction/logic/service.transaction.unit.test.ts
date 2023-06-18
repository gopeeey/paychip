import { TransactionService, TransactionServiceDependencies } from "@transaction/logic";
import { sessionMock } from "src/__tests__/helpers/mocks";
import { transactionData, transactionJson } from "src/__tests__/helpers/samples";

const repo = {
    create: jest.fn(),
};

const service = new TransactionService({ repo } as unknown as TransactionServiceDependencies);

describe("TESTING TRANSACTION SERIVCE", () => {
    describe("Testing createTransaction", () => {
        it("should return a new transaction object", async () => {
            repo.create.mockResolvedValue(transactionJson);
            const transaction = await service.createTransaction(transactionData, sessionMock);
            expect(transaction).toEqual(transactionJson);
            expect(repo.create).toHaveBeenCalledTimes(1);
            expect(repo.create).toHaveBeenCalledWith(transactionData, sessionMock);
        });
    });
});
