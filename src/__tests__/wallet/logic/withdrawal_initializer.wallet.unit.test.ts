import { CalculateTransactionChargesDto, ChargesCalculationResultDto } from "@charges/logic";
import { BankDetails } from "@payment_providers/logic";
import { WalletRepo } from "@wallet/data";
import {
    InitializeWithdrawalDto,
    InsufficientWalletBalanceError,
    WithdrawalInitializer,
    WithdrawalInitializerDependencies,
} from "@wallet/logic";
import { Pool } from "pg";
import { createSpies } from "src/__tests__/helpers/mocks";
import { chargeStackJson, currencyJson, walletJson } from "src/__tests__/helpers/samples";

const walletRepoMock = createSpies(new WalletRepo({} as Pool));

const dto = new InitializeWithdrawalDto({
    amount: 2000,
    accountNumber: "1234567890",
    bankCode: "056",
    walletId: walletJson.id,
});

const chargeCalculationResult = new ChargesCalculationResultDto({
    businessCharge: 50,
    businessChargesPaidBy: "wallet",
    businessGot: 0,
    businessPaid: 2020,
    platformCharge: 20,
    platformChargesPaidBy: "wallet",
    platformGot: 0,
    receiverPaid: 0,
    senderPaid: 2050,
    settledAmount: 2000,
});

const deps: { [key in keyof WithdrawalInitializerDependencies]: jest.Mock } = {
    getWalletByIdWithBusinessWallet: jest.fn(),
    verifyBankDetails: jest.fn(),
    calculateCharges: jest.fn(),
    getWalletChargeStack: jest.fn(),
    getCurrency: jest.fn(),
};

const withdrawalInitializer = new WithdrawalInitializer(dto, deps);

const testWallet = {
    ...walletJson,
    balance: 4000,
    parentWallet: { ...walletJson, balance: 4000, customFundingCs: [] },
    businessWalletId: walletJson.id,
};

const verifiedAccountDetails = new BankDetails({
    accountNumber: dto.accountNumber,
    bankCode: dto.bankCode,
    accountName: "Person Human",
});

const mockAll = () => {
    deps.getWalletByIdWithBusinessWallet.mockResolvedValue(testWallet);
    deps.verifyBankDetails.mockResolvedValue(verifiedAccountDetails);
    deps.getWalletChargeStack.mockResolvedValue(chargeStackJson.wallet);
    deps.calculateCharges.mockReturnValue(chargeCalculationResult);
    deps.getCurrency.mockResolvedValue(currencyJson);
};

describe("TESTING WITHDRAWAL INITIALIZER", () => {
    // Fetch wallet with business wallet
    it("should fetch the wallet with it's associated business wallet, if applicable", async () => {
        mockAll();
        await withdrawalInitializer.exec();
        expect(deps.getWalletByIdWithBusinessWallet).toHaveBeenCalledTimes(1);
        expect(deps.getWalletByIdWithBusinessWallet).toHaveBeenCalledWith(testWallet.id);
    });

    // Verify account information
    it("should verify the bank account details provided", async () => {
        mockAll();
        await withdrawalInitializer.exec();
        expect(deps.verifyBankDetails).toHaveBeenCalledTimes(1);
        expect(deps.verifyBankDetails).toHaveBeenCalledWith(
            new BankDetails({ accountNumber: dto.accountNumber, bankCode: dto.bankCode })
        );
    });

    // Fetch charge stack
    it("should fetch the wallet's charge stack", async () => {
        mockAll();
        await withdrawalInitializer.exec();
        expect(deps.getWalletChargeStack).toHaveBeenCalledTimes(1);
        expect(deps.getWalletChargeStack).toHaveBeenCalledWith(testWallet.id, "withdrawal");
    });

    describe("given the fetched businessWallet has no customerFunding ChargeStack", () => {
        it("should fetch the currency", async () => {
            mockAll();
            deps.getWalletByIdWithBusinessWallet.mockResolvedValue({
                ...testWallet,
                parentWallet: { ...testWallet, customFundingCs: null },
                businessWalletId: testWallet.id,
            });
            await withdrawalInitializer.exec();
            expect(deps.getCurrency).toHaveBeenCalledTimes(1);

            expect(deps.getCurrency).toHaveBeenCalledWith(testWallet.parentWallet.currency);
        });
    });

    // Calculate charges
    it("should calculate charges for the transaction", async () => {
        mockAll();
        await withdrawalInitializer.exec();
        expect(deps.calculateCharges).toHaveBeenCalledTimes(1);
        expect(deps.calculateCharges).toHaveBeenCalledWith(
            new CalculateTransactionChargesDto({
                amount: dto.amount,
                businessChargesPaidBy: "wallet",
                businessChargeStack: testWallet.parentWallet.w_withdrawalCs || [],
                customWalletChargeStack: chargeStackJson.wallet.charges,
                platformChargesPaidBy: "wallet",
                platformChargeStack: [],
                transactionType: "debit",
                waiveBusinessCharges: testWallet.waiveWithdrawalCharges,
            })
        );
    });

    // Check if wallet balance is sufficient
    describe("given the wallet balance is not sufficient to make the transaction", () => {
        it("should throw an insufficient wallet balance error", async () => {
            deps.getWalletByIdWithBusinessWallet.mockResolvedValue({
                ...testWallet,
                balance: 0,
                parentWallet: { ...walletJson, customFundingCs: [] },
            });
            await expect(() => withdrawalInitializer.exec()).rejects.toThrow(
                InsufficientWalletBalanceError
            );
        });
    });

    describe("given the parent wallet balance is not sufficient to make the transaction", () => {
        it("should throw an insufficient wallet balance error", async () => {
            deps.getWalletByIdWithBusinessWallet.mockResolvedValue({
                ...testWallet,
                parentWallet: { ...walletJson, balance: 0, customFundingCs: [] },
            });
            await expect(() => withdrawalInitializer.exec()).rejects.toThrow(
                InsufficientWalletBalanceError
            );
        });
    });
    // Make call to payment provider for transfer
    // Create transaction
    // Debit wallet
    // Return the transaction
});
