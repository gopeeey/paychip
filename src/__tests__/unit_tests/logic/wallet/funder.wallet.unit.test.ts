import { WalletRepo } from "@data/wallet";
import {
    FundWalletDto,
    GetUniqueWalletDto,
    InvalidFundingData,
    WalletFunder,
    WalletFunderDependencies,
} from "@logic/wallet";
import { Pool } from "pg";
import { createSpies } from "src/__tests__/mocks";
import { walletData, walletJson } from "src/__tests__/samples";

const walletRepoMock = createSpies(new WalletRepo({} as unknown as Pool));

const dependencies: WalletFunderDependencies = {
    getUniqueWallet:
        walletRepoMock.getUnique as unknown as WalletFunderDependencies["getUniqueWallet"],
    getWalletById: walletRepoMock.getById as unknown as WalletFunderDependencies["getWalletById"],
};

const dto = new FundWalletDto({
    businessId: walletData.businessId,
    amount: 2000,
    callbackUrl: "https://google.com",
    currency: walletData.currency,
    email: walletData.email,
});

const walletFunder = new WalletFunder(dto, dependencies);

describe("Testing WalletFunder", () => {
    describe("given valid walletId or currency and email", () => {
        it("should fetch the wallet", async () => {
            walletRepoMock.getById.mockResolvedValue(walletJson);
            walletRepoMock.getUnique.mockResolvedValue(walletJson);

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
    });

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
});
