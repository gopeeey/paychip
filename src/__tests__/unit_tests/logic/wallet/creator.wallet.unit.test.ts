import { WalletRepo } from "@data/wallet";
import { WalletCreator, WalletCreatorDependencies, DuplicateWalletError } from "@logic/wallet";
import { createSpies, sessionMock } from "src/__tests__/mocks";
import { bwJson, walletData, walletJson } from "src/__tests__/samples";

const dep = {
    dto: walletData,
    repo: createSpies(new WalletRepo()),
    getBusinessWallet: jest.fn(),
    session: sessionMock,
};

const walletCreator = new WalletCreator(dep as unknown as WalletCreatorDependencies);

const mockAll = () => {
    dep.repo.create.mockResolvedValue(walletJson);
    dep.repo.getUnique.mockResolvedValue(null);
    dep.getBusinessWallet.mockResolvedValue(bwJson);
};

describe("TESTING WALLET CREATOR", () => {
    it("should check if a wallet with the same currency, businessId and email already exists", async () => {
        mockAll();
        await walletCreator.create();
        expect(dep.repo.getUnique).toHaveBeenCalledTimes(1);
        expect(dep.repo.getUnique).toHaveBeenCalledWith({
            businessId: walletData.businessId,
            currency: walletData.currency,
            email: walletData.email,
        });
    });

    describe("Given the wallet already exists", () => {
        it("should throw a duplicate wallet error", async () => {
            dep.repo.getUnique.mockResolvedValue(walletJson);
            await expect(walletCreator.create()).rejects.toThrow(
                new DuplicateWalletError({
                    businessId: walletData.businessId,
                    email: walletData.email,
                    currency: walletData.currency,
                })
            );
        });
    });

    describe("Given the wallet does not already exist", () => {
        it("should fetch the corresponding business wallet", async () => {
            mockAll();
            await walletCreator.create();
            expect(dep.getBusinessWallet).toHaveBeenCalledTimes(1);
            expect(dep.getBusinessWallet).toHaveBeenCalledWith(
                walletData.businessId,
                walletData.currency
            );
        });

        it("should persist the wallet", async () => {
            mockAll();
            await walletCreator.create();
            expect(dep.repo.create).toHaveBeenCalledTimes(1);
            expect(dep.repo.create).toHaveBeenCalledWith(walletData, sessionMock);
        });

        it("should return a wallet object", async () => {
            mockAll();
            const wallet = await walletCreator.create();
            expect(wallet).toEqual(walletJson);
        });
    });
});
