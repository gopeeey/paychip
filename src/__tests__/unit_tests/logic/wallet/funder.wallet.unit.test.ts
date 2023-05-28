import { WalletRepo } from "@data/wallet";
import { GetSingleBusinessCustomerDto } from "@logic/customer";
import {
    FundWalletDto,
    GetUniqueWalletDto,
    InvalidFundingData,
    WalletFunder,
    WalletFunderDependencies,
} from "@logic/wallet";
import { Pool } from "pg";
import { createSpies } from "src/__tests__/mocks";
import {
    bwJson,
    chargeStackJson,
    currencyJson,
    customerJson,
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
};

const dependencies: WalletFunderDependencies = {
    getUniqueWallet:
        walletRepoMock.getUnique as unknown as WalletFunderDependencies["getUniqueWallet"],
    getWalletById: walletRepoMock.getById as unknown as WalletFunderDependencies["getWalletById"],
    ...depMocks,
};

const dto = new FundWalletDto({
    businessId: walletData.businessId,
    amount: 2000,
    callbackUrl: "https://google.com",
    currency: walletData.currency,
    email: walletData.email,
});

const walletFunder = new WalletFunder(dto, dependencies);

const mockAllDeps = () => {
    depMocks.getOrCreateCustomer.mockResolvedValue(customerJson.complete);
    depMocks.getBusinessWallet.mockResolvedValue(bwJson);
    depMocks.getCurrency.mockResolvedValue(currencyJson);
    depMocks.getWalletChargeStack.mockResolvedValue(chargeStackJson.wallet);
};

describe("Testing WalletFunder", () => {
    describe("given walletId is not present and currency or email is missing", () => {
        it("should throw an invalid funding data error", async () => {
            const badData: FundWalletDto[] = [
                { ...dto, email: undefined },
                { ...dto, currency: undefined },
                { ...dto, email: undefined, currency: undefined },
            ];

            for (const data of badData) {
                const setToFail = new WalletFunder(data, dependencies);
                await expect(setToFail.exec()).rejects.toThrow(new InvalidFundingData());
            }
        });
    });

    describe("given valid walletId or currency and email", () => {
        it("should fetch the wallet", async () => {
            walletRepoMock.getById.mockResolvedValue(walletJson);
            walletRepoMock.getUnique.mockResolvedValue(walletJson);
            mockAllDeps();

            const goodData: FundWalletDto[] = [
                dto,
                { ...dto, email: undefined, currency: undefined, walletId: "isdefined" },
            ];

            for (const data of goodData) {
                const shouldSucceed = new WalletFunder(data, dependencies);
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
            await walletFunder.exec();
            expect(depMocks.getOrCreateCustomer).toHaveBeenCalledTimes(1);

            const customerData = new GetSingleBusinessCustomerDto({
                businessId: dto.businessId,
                email: walletData.email,
            });
            expect(depMocks.getOrCreateCustomer).toHaveBeenCalledWith(customerData);
        });

        it("should fetch the businessWallet", async () => {
            mockAllDeps();
            await walletFunder.exec();
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
                await walletFunder.exec();
                expect(depMocks.getCurrency).toHaveBeenCalledTimes(1);

                expect(depMocks.getCurrency).toHaveBeenCalledWith(bwJson.currencyCode);
            });
        });

        it("should fetch the wallet's charge stack", async () => {
            mockAllDeps();
            await walletFunder.exec();
            expect(depMocks.getWalletChargeStack).toHaveBeenCalledTimes(1);

            expect(depMocks.getWalletChargeStack).toHaveBeenCalledWith(walletJson.id, "funding");
        });

        it("should calculate charges and amounts", async () => {
            mockAllDeps();
            await walletFunder.exec();
            expect(depMocks.calculateCharges).toHaveBeenCalledTimes(1);
        });
    });
});
