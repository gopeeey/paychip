import { WalletRepo } from "@data/wallet";
import { ChargesCalculationResultDto } from "@charges/logic";
import { GetSingleBusinessCustomerDto } from "@logic/customer";
import {
    InitializeFundingDto,
    GetUniqueWalletDto,
    InvalidFundingData,
    FundingInitializer,
    FundingInitializerDependencies,
} from "@logic/wallet";
import { Pool } from "pg";
import { createSpies, sessionMock } from "src/__tests__/mocks";
import {
    bwJson,
    chargeStackJson,
    currencyJson,
    customerJson,
    transactionJson,
    walletData,
    walletJson,
} from "src/__tests__/samples";

const walletRepoMock = createSpies(new WalletRepo({} as unknown as Pool));

const depMocks = {
    getOrCreateCustomer: jest.fn(),
    getBusinessWallet: jest.fn(),
    getCurrency: jest.fn(),
    getWalletChargeStack: jest.fn(),
    calculateCharges: jest.fn(),
    createTransaction: jest.fn(),
    generatePaymentLink: jest.fn(),
};

const dependencies: FundingInitializerDependencies = {
    getUniqueWallet:
        walletRepoMock.getUnique as unknown as FundingInitializerDependencies["getUniqueWallet"],
    getWalletById:
        walletRepoMock.getById as unknown as FundingInitializerDependencies["getWalletById"],
    ...depMocks,
    startSession: async () => sessionMock,
};

const dto = new InitializeFundingDto({
    businessId: walletData.businessId,
    amount: 2000,
    callbackUrl: "https://google.com",
    currency: walletData.currency,
    email: walletData.email,
});

const fundingInitializer = new FundingInitializer(dto, dependencies);

const chargeCalculationResult = new ChargesCalculationResultDto({
    businessCharge: 200,
    businessChargesPaidBy: "wallet",
    businessGot: 2000,
    businessPaid: 100,
    platformCharge: 1000,
    platformChargesPaidBy: "wallet",
    platformGot: 2000,
    receiverPaid: 10,
    senderPaid: 100,
    settledAmount: 5000,
});

const mockAllDeps = () => {
    depMocks.getOrCreateCustomer.mockResolvedValue(customerJson.complete);
    depMocks.getBusinessWallet.mockResolvedValue(bwJson);
    depMocks.getCurrency.mockResolvedValue(currencyJson);
    depMocks.getWalletChargeStack.mockResolvedValue(chargeStackJson.wallet);
    depMocks.calculateCharges.mockReturnValue(chargeCalculationResult);
    depMocks.createTransaction.mockResolvedValue(transactionJson);
    depMocks.generatePaymentLink.mockResolvedValue("https://dontmatter.com/payme");
};

describe("Testing FundingInitializer", () => {
    describe("given walletId is not present and currency or email is missing", () => {
        it("should throw an invalid funding data error", async () => {
            const badData: InitializeFundingDto[] = [
                { ...dto, email: undefined },
                { ...dto, currency: undefined },
                { ...dto, email: undefined, currency: undefined },
            ];

            for (const data of badData) {
                const setToFail = new FundingInitializer(data, dependencies);
                await expect(setToFail.exec()).rejects.toThrow(new InvalidFundingData());
            }
        });
    });

    describe("given valid walletId or currency and email", () => {
        it("should fetch the wallet", async () => {
            walletRepoMock.getById.mockResolvedValue(walletJson);
            walletRepoMock.getUnique.mockResolvedValue(walletJson);
            mockAllDeps();

            const goodData: InitializeFundingDto[] = [
                dto,
                { ...dto, email: undefined, currency: undefined, walletId: "isdefined" },
            ];

            for (const data of goodData) {
                const shouldSucceed = new FundingInitializer(data, dependencies);
                await shouldSucceed.exec();
                if (data.walletId) {
                    expect(walletRepoMock.getById).toHaveBeenCalledTimes(1);
                    expect(walletRepoMock.getById).toHaveBeenCalledWith(data.walletId);
                } else {
                    if (data.email && data.currency) {
                        expect(walletRepoMock.getUnique).toHaveBeenCalledTimes(1);
                        const expectedArg: GetUniqueWalletDto = {
                            businessId: data.businessId,
                            email: data.email,
                            currency: data.currency,
                        };
                        expect(walletRepoMock.getUnique).toHaveBeenCalledWith(expectedArg);
                    } else {
                        throw new Error("You not set the test data up properly then");
                    }
                }
            }
        });

        it("should fetch the customer", async () => {
            mockAllDeps();
            await fundingInitializer.exec();
            expect(depMocks.getOrCreateCustomer).toHaveBeenCalledTimes(1);

            const customerData = new GetSingleBusinessCustomerDto({
                businessId: dto.businessId,
                email: walletData.email,
            });
            expect(depMocks.getOrCreateCustomer).toHaveBeenCalledWith(customerData);
        });

        it("should fetch the businessWallet", async () => {
            mockAllDeps();
            await fundingInitializer.exec();
            expect(depMocks.getBusinessWallet).toHaveBeenCalledTimes(1);

            expect(depMocks.getBusinessWallet).toHaveBeenCalledWith(
                bwJson.businessId,
                bwJson.currencyCode
            );
        });

        describe("given the fetched businessWallet has no customerFunding ChargeStack", () => {
            it("should fetch the currency", async () => {
                mockAllDeps();
                depMocks.getBusinessWallet.mockResolvedValue({
                    ...bwJson,
                    customFundingCs: null,
                });
                await fundingInitializer.exec();
                expect(depMocks.getCurrency).toHaveBeenCalledTimes(1);

                expect(depMocks.getCurrency).toHaveBeenCalledWith(bwJson.currencyCode);
            });
        });

        it("should fetch the wallet's charge stack", async () => {
            mockAllDeps();
            await fundingInitializer.exec();
            expect(depMocks.getWalletChargeStack).toHaveBeenCalledTimes(1);

            expect(depMocks.getWalletChargeStack).toHaveBeenCalledWith(walletJson.id, "funding");
        });

        it("should calculate charges and amounts", async () => {
            mockAllDeps();
            await fundingInitializer.exec();
            expect(depMocks.calculateCharges).toHaveBeenCalledTimes(1);
        });

        it("should create a transaction", async () => {
            mockAllDeps();
            await fundingInitializer.exec();
            expect(depMocks.createTransaction).toHaveBeenCalledTimes(1);
        });

        it("should generate a payment link", async () => {
            mockAllDeps();
            await fundingInitializer.exec();
            expect(depMocks.generatePaymentLink).toHaveBeenCalledTimes(1);
        });
    });
});
