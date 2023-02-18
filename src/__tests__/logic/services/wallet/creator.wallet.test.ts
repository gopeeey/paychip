import { WalletCreatorDependencies } from "../../../../contracts/interfaces";
import { DuplicateWalletError } from "../../../../logic/errors";
import { WalletCreator } from "../../../../logic/services";
import { customerData, walletData, walletJson } from "../../../samples";

const dep = {
    dto: walletData,
    repo: {
        create: jest.fn(),
        getUnique: jest.fn(),
    },
    // createCustomer: jest.fn(),
};

const walletCreator = new WalletCreator(dep as unknown as WalletCreatorDependencies);

const mockAll = () => {
    dep.repo.create.mockResolvedValue(walletJson);
    dep.repo.getUnique.mockResolvedValue(null);
};

describe("TESTING BUSINESS CREATOR", () => {
    it("should check if a wallet with the same currency, businessId and email already exists", async () => {
        mockAll();
        await walletCreator.create();
        expect(dep.repo.getUnique).toHaveBeenCalledTimes(1);
        expect(dep.repo.getUnique).toHaveBeenCalledWith({
            businessId: walletJson.businessId,
            currency: walletJson.currency,
            email: walletJson.email,
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
        it("should proceed", () => {
            mockAll();
        });

        it("should persist the wallet", async () => {
            await walletCreator.create();
            expect(dep.repo.create).toHaveBeenCalledTimes(1);
            expect(dep.repo.create).toHaveBeenCalledWith(walletData);
        });

        // it("should create a customer for the wallet", async () => {
        //     await walletCreator.create();
        //     expect(dep.createCustomer).toHaveBeenCalledTimes(1);
        //     expect(dep.createCustomer).toHaveBeenCalledWith(customerData.incomplete);
        // });

        it("should return a wallet object", async () => {
            const wallet = await walletCreator.create();
            expect(wallet).toEqual(walletJson);
        });
    });
});
