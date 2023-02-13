import { Wallet } from "../../../db/models";
import { WalletRepo } from "../../../db/repos";
import { walletData, walletJson, walletObj } from "../../samples";

const modelContext = {
    create: jest.fn(),
    findByPk: jest.fn(),
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

    describe("Testing getById", () => {
        describe("Given the wallet exists", () => {
            it("should return a wallet json object", async () => {
                modelContext.findByPk.mockResolvedValue(walletObj);
                const data = walletJson.id;
                const wallet = await walletRepo.getById(data);
                expect(wallet).toEqual(walletJson);
                expect(modelContext.findByPk).toHaveBeenCalledTimes(1);
                expect(modelContext.findByPk).toHaveBeenCalledWith(data);
            });
        });

        describe("Given the wallet does not exist", () => {
            it("should return null", async () => {
                modelContext.findByPk.mockResolvedValue(null);
                const data = walletJson.id;
                const wallet = await walletRepo.getById(data);
                expect(wallet).toBeNull();
                expect(modelContext.findByPk).toHaveBeenCalledTimes(1);
                expect(modelContext.findByPk).toHaveBeenCalledWith(data);
            });
        });
    });
});
