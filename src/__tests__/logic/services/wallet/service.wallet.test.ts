import { WalletService } from "../../../../logic/services";
import { WalletRepoInterface, WalletServiceDependencies } from "../../../../contracts/interfaces";
import { WalletCreator } from "../../../../logic/services";
import { walletData, walletJson } from "../../../samples";

const deps = {
    repo: {
        create: jest.fn(),
        getUnique: jest.fn(),
    },
};

const walletService = new WalletService(deps as unknown as WalletServiceDependencies);
const walletCreatorSpy = jest.spyOn(WalletCreator.prototype, "create");

describe("TESTING WALLET SERVICE", () => {
    describe("Testing createWallet", () => {
        it("should run the wallet creator", async () => {
            deps.repo.create.mockResolvedValue(walletJson);
            await walletService.createWallet(walletData);
            expect(walletCreatorSpy).toHaveBeenCalledTimes(1);
        });
    });
});
