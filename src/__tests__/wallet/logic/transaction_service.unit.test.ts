import { VerifyTransferDto, VerifyTransferResponseDto } from "@payment_providers/logic";
import { TransferMessageDto } from "@queues/transfers";
import {
    TransactionNotFoundError,
    TransactionRepoInterface,
    TransactionService,
    TransactionServiceDependencies,
    UpdateTransactionInfoDto,
} from "@wallet/logic";
import moment from "moment";
import { sessionMock } from "src/__tests__/helpers/mocks";
import { transactionData, transactionJson } from "src/__tests__/helpers/samples";
import config from "src/config";

const repo: { [key in keyof TransactionRepoInterface]: jest.Mock } = {
    create: jest.fn(),
    getByReference: jest.fn(),
    startSession: jest.fn(async () => sessionMock),
    updateReference: jest.fn(),
    updateTransactionInfo: jest.fn(),
    getByRefAndStatus: jest.fn(),
    getPendingDebitThatHaveProviderRef: jest.fn(),
    createMultiple: jest.fn(),
    updateForRetrial: jest.fn(),
    getRetryTransfers: jest.fn(),
};

const deps: { [key in keyof Omit<TransactionServiceDependencies, "repo">]: jest.Mock } = {
    publishTransfersForVerification: jest.fn(),
    verifyTransfer: jest.fn(),
    publishTransfer: jest.fn(),
};

const service = new TransactionService({
    ...deps,
    repo,
} as unknown as TransactionServiceDependencies);

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

    describe(">>> enqueueTransfersForVerification", () => {
        it("should get the transfers using the getPendingDebitThatHaveProviderRef repo function", async () => {
            const expected = [transactionJson];
            repo.getPendingDebitThatHaveProviderRef.mockResolvedValue(expected);
            await service.enqueueTransfersForVerification();
            expect(repo.getPendingDebitThatHaveProviderRef).toHaveBeenCalledTimes(1);
        });

        it("should call the publishTransfersForVerification with the transfers", async () => {
            const callback = jest.fn();
            const expected = [transactionJson];
            repo.getPendingDebitThatHaveProviderRef.mockResolvedValue(expected);
            await service.enqueueTransfersForVerification(callback);
            expect(deps.publishTransfersForVerification).toHaveBeenCalledTimes(1);
            expect(deps.publishTransfersForVerification).toHaveBeenCalledWith(
                new VerifyTransferDto(transactionJson as VerifyTransferDto)
            );
            expect(callback).toHaveBeenCalledTimes(1);
        });
    });

    describe(">>> dequeueTransferVerificationTask", () => {
        const dto = new VerifyTransferDto({
            provider: transactionJson.provider as string,
            reference: transactionJson.reference,
        });

        const mockAll = () => {
            const expectedRes = new VerifyTransferResponseDto({
                status: "successful",
                providerRef: transactionJson.providerRef as string,
            });

            repo.getByReference.mockResolvedValue(transactionJson);
            repo.updateForRetrial.mockImplementation(async () => {});
            deps.verifyTransfer.mockResolvedValue(expectedRes);
        };

        it("should fetch the transaction", async () => {
            mockAll();
            await service.dequeueTransferVerificationTask(dto);
            expect(repo.getByReference).toHaveBeenCalledTimes(1);
            expect(repo.getByReference).toHaveBeenCalledWith(dto.reference);
        });

        describe("given no transaction is found", () => {
            it("should throw a transaction not found error", async () => {
                repo.getByReference.mockResolvedValue(null);
                await expect(service.dequeueTransferVerificationTask(dto)).rejects.toThrow(
                    TransactionNotFoundError
                );
                expect(repo.getByReference).toHaveBeenCalledTimes(1);
                expect(repo.getByReference).toHaveBeenCalledWith(dto.reference);
            });
        });

        describe("given the transaction is found", () => {
            const testRetryLogic = () => {
                describe("given the transaction has not reached the max number of retries", () => {
                    it("should call the updateForRetrial function with a date retrialMinutes minutes into the future", async () => {
                        mockAll();
                        repo.getByReference.mockResolvedValue({
                            ...transactionJson,
                            providerRef: config.payment.retryTempProviderRef,
                        });
                        await service.dequeueTransferVerificationTask(dto);
                        expect(repo.updateForRetrial).toHaveBeenCalledTimes(1);
                        expect(repo.updateForRetrial).toHaveBeenCalledWith(
                            transactionJson.id,
                            expect.any(Date)
                        );
                    });
                });

                describe("given the transaction has reached the max number of retries", () => {
                    it("should update the transaction status to failed", async () => {
                        mockAll();
                        repo.getByReference.mockResolvedValue({
                            ...transactionJson,
                            retries: config.payment.maxRetries,
                        });
                        await service.dequeueTransferVerificationTask(dto);
                        expect(repo.updateTransactionInfo).toHaveBeenCalledTimes(1);
                        expect(repo.updateTransactionInfo).toHaveBeenCalledWith(
                            transactionJson.id,
                            new UpdateTransactionInfoDto({
                                status: "failed",
                                channel: "bank",
                                providerRef: transactionJson.providerRef,
                            })
                        );
                    });
                });
            };
            describe("given the providerRef of the transaction is retryTempProviderRef", () => {
                testRetryLogic();
            });

            describe("given the providerRef of the transaction is not retryTempProviderRef", () => {
                it("should verify the transaction from the provider", async () => {
                    mockAll();
                    await service.dequeueTransferVerificationTask(dto);
                    expect(deps.verifyTransfer).toHaveBeenCalledTimes(1);
                    expect(deps.verifyTransfer).toHaveBeenCalledWith(dto);
                });

                describe("given the status of the verified transfer is not_found or pending", () => {
                    it("should do nothing, not update the transaction", async () => {
                        mockAll();
                        const testStatuses: VerifyTransferResponseDto["status"][] = [
                            "not_found",
                            "pending",
                        ];

                        for (const testStatus of testStatuses) {
                            deps.verifyTransfer.mockResolvedValue(
                                new VerifyTransferResponseDto({
                                    status: testStatus,
                                    providerRef: "doesn't matter",
                                })
                            );

                            await service.dequeueTransferVerificationTask(dto);

                            expect(repo.updateTransactionInfo).not.toHaveBeenCalled();
                        }
                    });
                });

                describe("given the status of the verified transfer is successful", () => {
                    it("should update the transaction with the new status and providerRef", async () => {
                        mockAll();
                        await service.dequeueTransferVerificationTask(dto);
                        expect(repo.updateTransactionInfo).toHaveBeenCalledTimes(1);
                        expect(repo.updateTransactionInfo).toHaveBeenCalledWith(
                            transactionJson.id,
                            new UpdateTransactionInfoDto({
                                channel: "bank",
                                providerRef: transactionJson.providerRef,
                                status: "successful",
                            })
                        );
                    });
                });

                describe("given the status of the verified transfer is failed", () => {
                    testRetryLogic();
                });
            });
        });
    });

    describe.only(">>> retryTransfers", () => {
        const past = moment().subtract(10, "minutes").toDate();
        const mockData = [{ ...transactionJson, status: "retrying", retryAt: past }];
        const callback = jest.fn(async () => {});

        const mockAll = () => {
            repo.getRetryTransfers.mockResolvedValue(mockData);
            repo.updateTransactionInfo.mockImplementation(async () => {});
            deps.publishTransfer.mockImplementation(async () => {});
        };

        it("should call the getRetryTransfers function on the repo", async () => {
            mockAll();
            await service.retryTransfers();
            expect(repo.getRetryTransfers).toHaveBeenCalledTimes(mockData.length);
        });

        it("should update each transaction with status as pending and providerRef as null", async () => {
            mockAll();
            await service.retryTransfers();
            expect(repo.updateTransactionInfo).toHaveBeenCalledTimes(mockData.length);
            expect(repo.updateTransactionInfo).toHaveBeenCalledWith(
                transactionJson.id,
                new UpdateTransactionInfoDto({
                    status: "pending",
                    providerRef: null,
                    channel: "bank",
                })
            );
        });

        it("should publish the transfers using the publishTransfer function", async () => {
            mockAll();
            await service.retryTransfers();
            expect(deps.publishTransfer).toHaveBeenCalledTimes(mockData.length);
            expect(deps.publishTransfer).toHaveBeenCalledWith(
                new TransferMessageDto({
                    amount: transactionJson.settledAmount,
                    bankDetails: {
                        accountName: transactionJson.accountName as string,
                        accountNumber: transactionJson.accountNumber as string,
                        bankCode: transactionJson.bankCode as string,
                    },
                    currencyCode: transactionJson.currency,
                    provider: transactionJson.provider as string,
                    reference: transactionJson.reference,
                })
            );
        });

        it("should call the callback function passed to it", async () => {
            mockAll();
            await service.retryTransfers(callback);
            expect(callback).toHaveBeenCalledTimes(1);
        });
    });
});

// CREATE THE FUNCTION (TO BE RUN IN THE BACKGROUND) THAT
// ACTUALLY FETCHES ALL THE TRANSFERS THAT NEED TO BE RETRIED AND RETRY THEM
