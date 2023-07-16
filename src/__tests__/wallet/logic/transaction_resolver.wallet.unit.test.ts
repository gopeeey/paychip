import { ChargesCalculationResultDto } from "@charges/logic";
import { GetSingleBusinessCustomerDto, UpdateCustomerDto } from "@customer/logic";
import { VerifyTransactionResponseDto } from "@payment_providers/logic";
import { TransactionModelInterface, UpdateTransactionInfoDto } from "@wallet/logic";
import {
    IncrementBalanceDto,
    TransactionResolutionError,
    TransactionResolver,
    TransactionResolverDependencies,
} from "@wallet/logic";
import { sessionMock, imdsServiceMock } from "src/__tests__/helpers/mocks";
import {
    businessWalletJson,
    chargeStackJson,
    currencyJson,
    customerJson,
    transactionJson,
    walletJson,
} from "src/__tests__/helpers/samples";

const deps: {
    [key in keyof Omit<
        TransactionResolverDependencies,
        "reference" | "provider" | "imdsService"
    >]: jest.Mock;
} = {
    createTransaction: jest.fn(),
    findTransactionByReference: jest.fn(),
    verifyTransactionFromProvider: jest.fn(),
    getWalletById: jest.fn(),
    calculateCharges: jest.fn(),
    getBusinessWallet: jest.fn(),
    getCurrency: jest.fn(),
    getWalletChargeStack: jest.fn(),
    getOrCreateCustomer: jest.fn(),
    startSession: jest.fn(async () => sessionMock),
    updateTransactionInfo: jest.fn(),
    incrementWalletBalance: jest.fn(),
    updateCustomer: jest.fn(),
};

const reference = transactionJson.reference;
const provider = transactionJson.provider as string;

const resolver = new TransactionResolver({
    reference,
    provider,
    ...deps,
    imdsService: imdsServiceMock,
});

const providerTransaction = new VerifyTransactionResponseDto({
    ...(transactionJson as Required<TransactionModelInterface>),
    status: "successful",
    walletId: walletJson.id,
    customerName: customerJson.complete.name,
    customerFirstName: customerJson.complete.firstName,
    customerLastName: customerJson.complete.lastName,
    customerPhone: customerJson.complete.phone,
});

const chargeResult = new ChargesCalculationResultDto({
    businessCharge: 700,
    businessGot: 4400,
    businessPaid: 600,
    platformCharge: 600,
    platformGot: 5000,
    receiverPaid: 700,
    senderPaid: 5000,
    settledAmount: 4300,
    businessChargesPaidBy: "wallet",
    platformChargesPaidBy: "wallet",
});

const imdsLock = "something";

const mockAll = () => {
    deps.verifyTransactionFromProvider.mockResolvedValue(providerTransaction);
    deps.findTransactionByReference.mockResolvedValue(transactionJson);
    deps.getWalletById.mockResolvedValue(walletJson);
    deps.getBusinessWallet.mockResolvedValue(businessWalletJson);
    deps.getCurrency.mockResolvedValue(currencyJson);
    deps.createTransaction.mockResolvedValue(transactionJson);
    deps.getOrCreateCustomer.mockResolvedValue(customerJson.complete);
    deps.getWalletChargeStack.mockResolvedValue(chargeStackJson.wallet);
    deps.calculateCharges.mockResolvedValue(chargeResult);
    deps.updateTransactionInfo.mockImplementation(async () => {});
    deps.incrementWalletBalance.mockImplementation(async () => {});
    imdsServiceMock.lock.mockResolvedValue(imdsLock);
};

describe("TESTING PAYMENT RESOLVER", () => {
    it("should acquire a lock for the transaction reference", async () => {
        mockAll();
        await resolver.exec();
        expect(imdsServiceMock.lock).toHaveBeenCalledTimes(1);
        expect(imdsServiceMock.lock).toHaveBeenCalledWith(providerTransaction.reference, 20);
    });

    describe("given it does not receive a lock", () => {
        it("should throw an error indicating that", async () => {
            imdsServiceMock.lock.mockResolvedValueOnce(null);
            await expect(resolver.exec).rejects.toThrow(
                new TransactionResolutionError("Failed to lock transaction", providerTransaction)
            );
        });
    });

    describe("given it receives a lock", () => {
        it("should verify the transaction from the appropriate provider", async () => {
            mockAll();
            await resolver.exec();
            expect(deps.verifyTransactionFromProvider).toHaveBeenCalledTimes(1);
            expect(deps.verifyTransactionFromProvider).toHaveBeenCalledWith(reference, provider);
        });

        describe("given provider does not return transaction details", () => {
            it("should throw a TransactionResolutionError", async () => {
                deps.verifyTransactionFromProvider.mockResolvedValue(null);
                await expect(() => resolver.exec()).rejects.toThrow(TransactionResolutionError);
            });
        });

        describe("given the provider returns the transaction details", () => {
            it("should fetch the associated wallet", async () => {
                mockAll();
                await resolver.exec();
                expect(deps.getWalletById).toHaveBeenCalledTimes(1);
                expect(deps.getWalletById).toHaveBeenCalledWith(walletJson.id);
            });

            it("should fetch the customer", async () => {
                await resolver.exec();
                expect(deps.getOrCreateCustomer).toHaveBeenCalledTimes(1);
                expect(deps.getOrCreateCustomer).toHaveBeenCalledWith(
                    new GetSingleBusinessCustomerDto({
                        businessId: walletJson.businessId,
                        email: walletJson.email,
                    })
                );
            });

            it("should attempt to get the corresponding transaction from the database by reference", async () => {
                await resolver.exec();
                expect(deps.findTransactionByReference).toHaveBeenCalledTimes(1);
                expect(deps.findTransactionByReference).toHaveBeenCalledWith(reference);
            });

            describe("given the corresponding transaction was not found", () => {
                it("should create a new transaction from the transaction details", async () => {
                    deps.findTransactionByReference.mockResolvedValue(null);
                    await resolver.exec();
                    expect(deps.createTransaction).toHaveBeenCalledWith(
                        expect.objectContaining({ amount: transactionJson.amount }),
                        sessionMock
                    );
                    expect(deps.getBusinessWallet).toHaveBeenCalledTimes(1);
                    expect(deps.getCurrency).toHaveBeenCalledTimes(1);
                    expect(deps.getWalletChargeStack).toHaveBeenCalledTimes(1);
                });
            });

            describe("given the corresponding transaction was found, or a new one was created", () => {
                describe("given the status of the transaction is not pending", () => {
                    it("should throw a transaction resolution error", async () => {
                        deps.findTransactionByReference.mockResolvedValue({
                            ...transactionJson,
                            status: "failed",
                        });
                        await expect(resolver.exec).rejects.toThrow(
                            new TransactionResolutionError(
                                "Transaction does not have a status of pending",
                                providerTransaction
                            )
                        );
                    });
                });

                describe("given there is a business charge on the transaction", () => {
                    it("should create a separate transaction to hold the business charge", async () => {
                        mockAll();
                        await resolver.exec();
                        expect(deps.createTransaction).toHaveBeenCalledWith(
                            expect.objectContaining({ amount: transactionJson.businessCharge }),
                            sessionMock
                        );
                    });
                });

                it("should update the transaction info", async () => {
                    mockAll();
                    await resolver.exec();
                    expect(deps.updateTransactionInfo).toHaveBeenCalledWith(
                        expect.anything(),
                        new UpdateTransactionInfoDto(providerTransaction),
                        sessionMock
                    );
                });

                it("should increment the wallet balance with the settled amount", async () => {
                    mockAll();
                    await resolver.exec();
                    expect(deps.incrementWalletBalance).toHaveBeenCalledWith(
                        new IncrementBalanceDto({
                            walletId: walletJson.id,
                            amount: transactionJson.settledAmount,
                            session: sessionMock,
                        })
                    );
                });

                it("should increment the business wallet balance with how much the busniness got", async () => {
                    mockAll();
                    await resolver.exec();
                    expect(deps.incrementWalletBalance).toHaveBeenCalledWith(
                        new IncrementBalanceDto({
                            walletId: businessWalletJson.id,
                            amount: transactionJson.businessGot,
                            session: sessionMock,
                        })
                    );
                });
            });

            it("should update the customer", async () => {
                await resolver.exec();
                expect(deps.updateCustomer).toHaveBeenCalledTimes(1);
                expect(deps.updateCustomer).toHaveBeenCalledWith(
                    new UpdateCustomerDto({
                        id: customerJson.complete.id,
                        name: providerTransaction.customerName,
                        firstName: providerTransaction.customerFirstName,
                        lastName: providerTransaction.customerLastName,
                        phone: providerTransaction.customerPhone,
                    }),
                    sessionMock
                );
            });
        });

        it("should release the lock on the reference", async () => {
            mockAll();
            await resolver.exec();
            expect(imdsServiceMock.release).toHaveBeenCalledTimes(1);
            expect(imdsServiceMock.release).toHaveBeenCalledWith(
                providerTransaction.reference,
                imdsLock
            );
        });
    });
});
