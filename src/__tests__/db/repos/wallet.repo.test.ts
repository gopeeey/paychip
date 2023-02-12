import { Wallet } from "../../../db/models";
import { WalletRepo } from "../../../db/repos";
import { walletData, walletJson, walletObj } from "../../samples";

const modelContext = {
    create: jest.fn(),
};

const walletRepo = new WalletRepo(modelContext as unknown as typeof Wallet);

describe("TESTING WALLET REPO", () => {
    describe("Testing create", () => {
        it("should return a json wallet object", async () => {
            modelContext.create.mockResolvedValue(walletObj);
            const wallet = await walletRepo.create(walletData);
            expect(wallet).toEqual(walletJson);
            expect(modelContext.create).toHaveBeenCalledTimes(1);
            expect(modelContext.create).toHaveBeenCalledWith(walletData);
        });
    });
});
