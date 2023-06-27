import { ChargesCalculationResultDto } from "@charges/logic";
import { VerifyTransactionResponseDto } from "@third_party/payment_providers/logic";
import { TransactionModelInterface } from "@transaction/logic";
import {
    IncrementBalanceDto,
    PaymentResolutionError,
    PaymentResolver,
    PaymentResolverDependencies,
} from "@wallet/logic";
import { sessionMock } from "src/__tests__/helpers/mocks";
import {
    bwJson,
    chargeStackJson,
    currencyJson,
    customerJson,
    transactionJson,
    walletJson,
} from "src/__tests__/helpers/samples";

const deps: {
    [key in keyof Omit<PaymentResolverDependencies, "reference" | "provider">]: jest.Mock;
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
    updateTransactionStatus: jest.fn(),
    incrementWalletBalance: jest.fn(),
};

const reference = transactionJson.reference;
const provider = transactionJson.provider as string;

const resolver = new PaymentResolver({ reference, provider, ...deps });

const providerTransaction = new VerifyTransactionResponseDto({
    ...(transactionJson as Required<TransactionModelInterface>),
    status: "successful",
    walletId: walletJson.id,
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

const mockAll = () => {
    deps.verifyTransactionFromProvider.mockResolvedValue(providerTransaction);
    deps.findTransactionByReference.mockResolvedValue(transactionJson);
    deps.getWalletById.mockResolvedValue(walletJson);
    deps.getBusinessWallet.mockResolvedValue(bwJson);
    deps.getCurrency.mockResolvedValue(currencyJson);
    deps.createTransaction.mockResolvedValue(transactionJson);
    deps.getOrCreateCustomer.mockResolvedValue(customerJson.complete);
    deps.getWalletChargeStack.mockResolvedValue(chargeStackJson.wallet);
    deps.calculateCharges.mockResolvedValue(chargeResult);
    deps.updateTransactionStatus.mockImplementation(async () => {});
    deps.incrementWalletBalance.mockImplementation(async () => {});
};

describe("TESTING PAYMENT RESOLVER", () => {
    it("should verify the transaction from the appropriate provider", async () => {
        mockAll();
        await resolver.exec();
        expect(deps.verifyTransactionFromProvider).toHaveBeenCalledTimes(1);
        expect(deps.verifyTransactionFromProvider).toHaveBeenCalledWith(reference, provider);
    });

    describe("given the provider returns the transaction details", () => {
        it("should fetch the associated wallet", async () => {
            await resolver.exec();
            expect(deps.getWalletById).toHaveBeenCalledTimes(1);
            expect(deps.getWalletById).toHaveBeenCalledWith(walletJson.id);
        });

        it("should attempt to get the corresponding transaction from the database by reference", async () => {
            await resolver.exec();
            expect(deps.findTransactionByReference).toHaveBeenCalledTimes(1);
            expect(deps.findTransactionByReference).toHaveBeenCalledWith(reference);
        });
        // If no corresponding transactions were found, it should create a new one
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
                expect(deps.getOrCreateCustomer).toHaveBeenCalledTimes(1);
            });
        });

        describe("given the corresponding transaction was found, or a new one was created", () => {
            describe("given there is a business charge on the transaction", () => {
                it("should create a separate transaction to hold the business charge", async () => {
                    await resolver.exec();
                    expect(deps.createTransaction).toHaveBeenCalledWith(
                        expect.objectContaining({ amount: transactionJson.businessCharge }),
                        sessionMock
                    );
                });
            });

            it("should update the transaction status", async () => {
                await resolver.exec();
                expect(deps.updateTransactionStatus).toHaveBeenCalledWith(
                    expect.anything(),
                    "successful",
                    sessionMock
                );
            });

            it("should increment the wallet balance with the settled amount", async () => {
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
                await resolver.exec();
                // continue from here
            });
        });
    });

    describe("given provider does not return transaction details", () => {
        it("should throw a PaymentResolutionError", async () => {
            deps.verifyTransactionFromProvider.mockResolvedValue(null);
            await expect(() => resolver.exec()).rejects.toThrow(PaymentResolutionError);
        });
    });
});
