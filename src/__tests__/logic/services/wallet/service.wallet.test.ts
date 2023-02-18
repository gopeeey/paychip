import { WalletService } from "../../../../logic/services";
import { WalletRepoInterface, WalletServiceDependencies } from "../../../../contracts/interfaces";
import * as WalletCreatorModule from "../../../../logic/services/wallet/creator.wallet";
import { walletData, walletJson } from "../../../samples";

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
    },
};

const walletService = new WalletService(deps as unknown as WalletServiceDependencies);

describe("TESTING WALLET SERVICE", () => {
    describe("Testing createWallet", () => {
        it("should run the wallet creator", async () => {
            createFn.mockResolvedValue(walletJson);
            await walletService.createWallet(walletData);
            expect(WalletCreator).toHaveBeenCalledTimes(1);
            expect(WalletCreator).toHaveBeenCalledWith({
                dto: walletData,
                ...deps,
            });
            expect(createFn).toHaveBeenCalledTimes(1);
        });

        it("should return a wallet object", async () => {
            createFn.mockResolvedValue(walletJson);
            const wallet = await walletService.createWallet(walletData);
            expect(wallet).toEqual(walletJson);
        });
    });
});
