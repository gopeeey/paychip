import {
    InitializeFundingDto,
    GetUniqueWalletDto,
    WalletCreatorDependencies,
    WalletNotFoundError,
    WalletService,
    WalletServiceDependencies,
    PaymentResolutionError,
    IncrementBalanceDto,
    PaymentResolverDependencies,
} from "@wallet/logic";
import * as WalletCreatorModule from "@wallet/logic/creator.wallet";
import * as PaymentResolverModule from "@wallet/logic/payment_resolver.wallet";
import * as FundingInitializerModule from "@wallet/logic/funding_initializer.wallet";
import {
    businessWalletJson,
    transactionJson,
    walletData,
    walletJson,
} from "src/__tests__/helpers/samples";
import { SpiesObj, createSpies, sessionMock } from "src/__tests__/helpers/mocks";
import { WalletRepo } from "@wallet/data";
import { Pool } from "pg";
import { VerifyTransactionResponseDto } from "@third_party/payment_providers/logic";
import { SessionInterface } from "@bases/logic";

const createFn = jest.fn();
jest.mock("../../../wallet/logic/creator.wallet", () => ({
    WalletCreator: jest.fn(() => ({ create: createFn })),
}));

const execFunder = jest.fn();
jest.mock("../../../wallet/logic/funding_initializer.wallet", () => ({
    FundingInitializer: jest.fn(() => ({ exec: execFunder })),
}));

const execPaymentResolver = jest.fn();
jest.mock("../../../wallet/logic/payment_resolver.wallet", () => ({
    PaymentResolver: jest.fn(() => ({ exec: execPaymentResolver })),
}));

const WalletCreator =
    WalletCreatorModule.WalletCreator as unknown as jest.Mock<WalletCreatorModule.WalletCreator>;

const FundingInitializer =
    FundingInitializerModule.FundingInitializer as unknown as jest.Mock<FundingInitializerModule.FundingInitializer>;

const PaymentResolver =
    PaymentResolverModule.PaymentResolver as unknown as jest.Mock<PaymentResolverModule.PaymentResolver>;

const walletRepoMock = createSpies(new WalletRepo({} as Pool));

const deps: { [key in keyof Omit<WalletServiceDependencies, "repo">]: jest.Mock } = {
    getCurrency: jest.fn(),
    getWalletChargeStack: jest.fn(),
    calculateCharges: jest.fn(),
    createTransaction: jest.fn(),
    generatePaymentLink: jest.fn(),
    getOrCreateCustomer: jest.fn(),
    verifyTransactionFromProvider: jest.fn(),
    findTransactionByReference: jest.fn(),
    updateTransactionInfo: jest.fn(),
};

const walletService = new WalletService({
    ...deps,
    repo: walletRepoMock,
} as unknown as WalletServiceDependencies);

describe("TESTING WALLET SERVICE", () => {
    describe(">>> createWallet", () => {
        it("should run the wallet creator", async () => {
            createFn.mockResolvedValue(walletJson);
            await walletService.createWallet(walletData, sessionMock);
            expect(WalletCreator).toHaveBeenCalledTimes(1);

            const calledWith: WalletCreatorDependencies = {
                dto: walletData,
                repo: walletRepoMock as unknown as WalletCreatorDependencies["repo"],
                getBusinessWallet:
                    walletService.getBusinessWalletByCurrency as WalletCreatorDependencies["getBusinessWallet"],
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

    describe(">>> initializeFunding", () => {
        it("should return a link", async () => {
            const expectedLink = "https://example.com";
            execFunder.mockResolvedValue(expectedLink);
            const fundingDto: InitializeFundingDto = {
                amount: 300,
                businessId: 2,
                callbackUrl: "https://eg.com",
                currency: "NGN",
                email: "example@test.com",
                walletId: "walletId",
            };
            const link = await walletService.initializeFunding(fundingDto);

            expect(link).toBe(expectedLink);
            expect(FundingInitializer).toHaveBeenCalledTimes(1);
            expect(execFunder).toHaveBeenCalledTimes(1);
        });
    });

    describe(">>> incrementBalance", () => {
        it("should call repo function to increment balance", async () => {
            walletRepoMock.incrementBalance.mockImplementation(async () => {});
            const data = new IncrementBalanceDto({
                walletId: "sokme",
                amount: 400,
                session: sessionMock,
            });
            await walletService.incrementBalance(data);
            expect(walletRepoMock.incrementBalance).toHaveBeenCalledWith(data);
        });
    });

    describe(">>> resolvePayment", () => {
        it("should instantiate the payment resolver and execute it with the correct data", async () => {
            execPaymentResolver.mockResolvedValue(null);
            const provider = "aProvider";
            const reference = "ref";
            const expectedArgs: PaymentResolverDependencies = {
                calculateCharges: deps.calculateCharges,
                createTransaction: deps.createTransaction,
                findTransactionByReference: deps.findTransactionByReference,
                getBusinessWallet: walletService.getBusinessWalletByCurrency,
                getCurrency: deps.getCurrency,
                getOrCreateCustomer: deps.getOrCreateCustomer,
                getWalletById: walletService.getWalletById,
                getWalletChargeStack: deps.getWalletChargeStack,
                incrementWalletBalance: walletService.incrementBalance,
                provider,
                reference,
                startSession:
                    walletRepoMock.startSession as unknown as () => Promise<SessionInterface>,
                updateTransactionInfo: deps.updateTransactionInfo,
                verifyTransactionFromProvider: deps.verifyTransactionFromProvider,
            };
            await walletService.resolvePayment({ provider, reference });

            expect(PaymentResolver).toHaveBeenCalledTimes(1);
            expect(PaymentResolver).toHaveBeenCalledWith(expectedArgs);
            expect(execPaymentResolver).toHaveBeenCalledTimes(1);
        });
    });

    describe(">>> getBusinessWalletByCurrency", () => {
        describe("given the repo returns a wallet object", () => {
            it("should return the wallet object", async () => {
                walletRepoMock.getBusinessWalletByCurrency.mockResolvedValue(businessWalletJson);
                const data = [1234, "NGN"] as const;
                const bw = await walletService.getBusinessWalletByCurrency(...data);
                expect(bw).toEqual(businessWalletJson);
                expect(walletRepoMock.getBusinessWalletByCurrency).toHaveBeenCalledTimes(1);
                expect(walletRepoMock.getBusinessWalletByCurrency).toHaveBeenCalledWith(...data);
            });
        });

        describe("given the repo returns null", () => {
            it("should throw a BusinessWalletNotFoundError", async () => {
                walletRepoMock.getBusinessWalletByCurrency.mockResolvedValue(null);
                const data = [1234, "NGN"] as const;
                await expect(walletService.getBusinessWalletByCurrency(...data)).rejects.toThrow(
                    new WalletNotFoundError(data[1])
                );
                expect(walletRepoMock.getBusinessWalletByCurrency).toHaveBeenCalledWith(...data);
            });
        });
    });
});
