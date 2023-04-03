import { WalletService, WalletServiceDependencies } from "@logic/wallet";
import * as WalletCreatorModule from "@logic/wallet/creator.wallet";
import { walletData, walletJson } from "src/__tests__/samples";
import { sessionMock } from "src/__tests__/mocks";

const createFn = jest.fn();
jest.mock("../../../../logic/wallet/creator.wallet", () => ({
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
};

const walletService = new WalletService(deps as unknown as WalletServiceDependencies);

const createWalletMock = jest.spyOn(walletService, "createWallet");

describe("TESTING WALLET SERVICE", () => {
    describe("Testing createWallet", () => {
        it("should run the wallet creator", async () => {
            createFn.mockResolvedValue(walletJson);
            await walletService.createWallet(walletData, sessionMock);
            expect(WalletCreator).toHaveBeenCalledTimes(1);
            expect(WalletCreator).toHaveBeenCalledWith({
                dto: walletData,
                repo: deps.repo,
                session: sessionMock,
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
