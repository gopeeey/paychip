import {
    FundWalletDto,
    GetUniqueWalletDto,
    WalletCreatorDependencies,
    WalletNotFoundError,
    WalletService,
    WalletServiceDependencies,
} from "@logic/wallet";
import * as WalletCreatorModule from "@logic/wallet/creator.wallet";
import * as WalletFunderModule from "@logic/wallet/funder.wallet";
import { walletData, walletJson } from "src/__tests__/samples";
import { createSpies, sessionMock } from "src/__tests__/mocks";
import { WalletRepo } from "@data/wallet";
import { Pool } from "pg";

const createFn = jest.fn();
jest.mock("../../../../logic/wallet/creator.wallet", () => ({
    WalletCreator: jest.fn(() => ({ create: createFn })),
}));

const execFunder = jest.fn();
jest.mock("../../../../logic/wallet/funder.wallet", () => ({
    WalletFunder: jest.fn(() => ({ exec: execFunder })),
}));

const WalletCreator =
    WalletCreatorModule.WalletCreator as unknown as jest.Mock<WalletCreatorModule.WalletCreator>;

const WalletFunder =
    WalletFunderModule.WalletFunder as unknown as jest.Mock<WalletFunderModule.WalletFunder>;

const walletRepoMock = createSpies(new WalletRepo({} as Pool));

const deps: WalletServiceDependencies = {
    repo: walletRepoMock as unknown as WalletRepo,
    getBusinessWallet: jest.fn(),
    getCurrency: jest.fn(),
    getWalletChargeStack: jest.fn(),
    calculateCharges: jest.fn(),
    createTransaction: jest.fn(),
    generatePaymentLink: jest.fn(),
    getOrCreateCustomer: jest.fn(),
};

const walletService = new WalletService(deps);

describe("TESTING WALLET SERVICE", () => {
    describe(">>> createWallet", () => {
        it("should run the wallet creator", async () => {
            createFn.mockResolvedValue(walletJson);
            await walletService.createWallet(walletData, sessionMock);
            expect(WalletCreator).toHaveBeenCalledTimes(1);

            const calledWith: WalletCreatorDependencies = {
                dto: walletData,
                repo: deps.repo,
                getBusinessWallet: deps.getBusinessWallet,
                session: sessionMock,
            };
            expect(WalletCreator).toHaveBeenCalledWith(calledWith);
            expect(createFn).toHaveBeenCalledTimes(1);
        });

        it("should return a wallet object", async () => {
            createFn.mockResolvedValue(walletJson);
            const wallet = await walletService.createWallet(walletData);
            expect(wallet).toEqual(walletJson);
        });
    });

    describe(">>> getWalletById", () => {
        describe("given the wallet exists", () => {
            it("should return a wallet object", async () => {
                walletRepoMock.getById.mockResolvedValue(walletJson);
                const id = walletJson.id;
                const wallet = await walletService.getWalletById(id);
                expect(wallet).toBeDefined();
                expect(wallet.id).toBe(id);
                expect(walletRepoMock.getById).toHaveBeenCalledTimes(1);
                expect(walletRepoMock.getById).toHaveBeenCalledWith(id);
            });
        });

        describe("given the wallet does not exist", () => {
            it("should throw a wallet not found error", async () => {
                walletRepoMock.getById.mockResolvedValue(null);
                const id = "someId";
                await expect(async () => walletService.getWalletById(id)).rejects.toThrow(
                    new WalletNotFoundError(id)
                );
            });
        });
    });

    describe(">>> getUniqueWallet", () => {
        describe("given the wallet exists", () => {
            it("should return a wallet object", async () => {
                walletRepoMock.getUnique.mockResolvedValue(walletJson);
                const data = new GetUniqueWalletDto(walletJson);
                const wallet = await walletService.getUniqueWallet(data);
                expect(wallet).toBeDefined();
                expect(wallet.id).toBe(walletJson.id);
                expect(walletRepoMock.getUnique).toHaveBeenCalledTimes(1);
                expect(walletRepoMock.getUnique).toHaveBeenCalledWith(data);
            });
        });

        describe("given the wallet does not exist", () => {
            it("should throw a wallet not found error", async () => {
                walletRepoMock.getUnique.mockResolvedValue(null);
                const data: GetUniqueWalletDto = {
                    businessId: 1,
                    email: "not@found.com",
                    currency: "NGN",
                };
                await expect(async () => walletService.getUniqueWallet(data)).rejects.toThrow(
                    new WalletNotFoundError(data)
                );
            });
        });
    });

    describe(">>> generateFundingLink", () => {
        it("should return a link", async () => {
            const expectedLink = "https://example.com";
            execFunder.mockResolvedValue(expectedLink);
            const fundingDto: FundWalletDto = {
                amount: 300,
                businessId: 2,
                callbackUrl: "https://eg.com",
                currency: "NGN",
                email: "example@test.com",
                walletId: "walletId",
            };
            const link = await walletService.generateFundingLink(fundingDto);

            expect(link).toBe(expectedLink);
            expect(WalletFunder).toHaveBeenCalledTimes(1);
            expect(execFunder).toHaveBeenCalledTimes(1);
        });
    });
});
