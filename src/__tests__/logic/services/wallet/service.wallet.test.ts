import { WalletService } from "../../../../logic/services";
import { WalletRepoInterface, WalletServiceDependencies } from "../../../../contracts/interfaces";
import * as WalletCreatorModule from "../../../../logic/services/wallet/creator.wallet";
import {
    currencyJson,
    currencyJsonArr,
    walletData,
    walletJson,
    walletJsons,
    walletSampleData,
} from "../../../samples";
import {
    BusinessCurrencyNotSupportedError,
    BusinessRootWalletNotFoundError,
} from "../../../../logic/errors";

const createFn = jest.fn();
jest.mock("../../../../logic/services/wallet/creator.wallet", () => ({
    WalletCreator: jest.fn(() => ({ create: createFn })),
}));

const WalletCreator =
    WalletCreatorModule.WalletCreator as unknown as jest.Mock<WalletCreatorModule.WalletCreator>;

const deps = {
    repo: {
        create: jest.fn(),
        getUnique: jest.fn(),
        getBusinessRootWallet: jest.fn(),
    },
    isSupportedBusinessCurrency: jest.fn(),
};

const walletService = new WalletService(deps as unknown as WalletServiceDependencies);

const createWalletMock = jest.spyOn(walletService, "createWallet");

describe("TESTING WALLET SERVICE", () => {
    describe("Testing createWallet", () => {
        it("should run the wallet creator", async () => {
            createFn.mockResolvedValue(walletJson);
            await walletService.createWallet(walletData);
            expect(WalletCreator).toHaveBeenCalledTimes(1);
            expect(WalletCreator).toHaveBeenCalledWith({
                dto: walletData,
                repo: deps.repo,
            });
            expect(createFn).toHaveBeenCalledTimes(1);
        });

        it("should return a wallet object", async () => {
            createFn.mockResolvedValue(walletJson);
            const wallet = await walletService.createWallet(walletData);
            expect(wallet).toEqual(walletJson);
        });
    });

    describe("Testing createBusinessWallet", () => {
        it("should check if the parent wallet exists", async () => {
            deps.repo.getBusinessRootWallet.mockResolvedValue(walletJson);
            deps.isSupportedBusinessCurrency.mockResolvedValue(true);

            await walletService.createBusinessWallet(walletData);
            expect(deps.repo.getBusinessRootWallet).toHaveBeenCalledTimes(1);
            expect(deps.repo.getBusinessRootWallet).toHaveBeenCalledWith(
                walletData.businessId,
                walletData.currency
            );
        });

        describe("Given the parent wallet does not exist", () => {
            it("should throw business wallet not found error", async () => {
                deps.repo.getBusinessRootWallet.mockResolvedValue(null);
                await expect(walletService.createBusinessWallet(walletData)).rejects.toThrow(
                    new BusinessRootWalletNotFoundError(walletData.businessId, walletData.currency)
                );
            });
        });

        describe("Given the parent wallet exists", () => {
            it("should check if the provided currency is supported by the business", async () => {
                deps.isSupportedBusinessCurrency.mockResolvedValue(true);
                deps.repo.getBusinessRootWallet.mockResolvedValue(walletJsons.noParent);
                await walletService.createBusinessWallet(walletData);
                expect(deps.isSupportedBusinessCurrency).toHaveBeenCalledTimes(1);
                expect(deps.isSupportedBusinessCurrency).toHaveBeenCalledWith(
                    walletData.businessId,
                    walletData.currency
                );
            });

            describe("Given the currency is not supported", () => {
                it("should throw a business currency not supported error", async () => {
                    deps.isSupportedBusinessCurrency.mockResolvedValue(false);
                    await expect(walletService.createBusinessWallet(walletData)).rejects.toThrow(
                        new BusinessCurrencyNotSupportedError(walletData.currency)
                    );
                });
            });

            describe("Given the currency is supported", () => {
                it("should create a wallet with the business wallet's id as the new wallet's parentWalletId", async () => {
                    deps.isSupportedBusinessCurrency.mockResolvedValue(true);
                    deps.repo.getBusinessRootWallet.mockResolvedValue(walletJson);
                    createWalletMock.mockResolvedValue(walletJsons.withParent);
                    const wallet = await walletService.createBusinessWallet(walletData);
                    expect(wallet).toEqual(walletJsons.withParent);
                    expect(createWalletMock).toHaveBeenCalledTimes(1);
                    expect(createWalletMock).toHaveBeenCalledWith(walletSampleData.withParent);
                });
            });
        });
    });
});
