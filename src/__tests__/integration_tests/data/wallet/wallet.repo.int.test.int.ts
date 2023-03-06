import { Wallet, WalletRepo } from "@data/wallet";
import { walletData, walletJson, walletObj } from "src/__tests__/samples";
import { generateIdMock, sessionMock } from "src/__tests__/mocks";

const modelContext = {
    create: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
};

const walletRepo = new WalletRepo(modelContext as unknown as typeof Wallet);

// seed data

describe("TESTING WALLET REPO", () => {
    describe("Testing create", () => {
        it("should return a json wallet object", async () => {
            const id = "cat";
            generateIdMock.mockReturnValue(id);
            modelContext.create.mockResolvedValue(walletObj);
            const wallet = await walletRepo.create(walletData, sessionMock);
            expect(wallet).toEqual(walletJson);
            expect(modelContext.create).toHaveBeenCalledTimes(1);
            expect(modelContext.create).toHaveBeenCalledWith(
                { ...walletData, id },
                { transaction: sessionMock }
            );
            expect(generateIdMock).toHaveBeenCalledTimes(1);
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

    describe("Testing getUnique", () => {
        describe("Given the wallet exists", () => {
            it("should return a wallet json object", async () => {
                modelContext.findOne.mockResolvedValue(walletObj);
                const data = walletJson;
                const wallet = await walletRepo.getUnique(data);
                expect(wallet).toEqual(walletJson);
                expect(modelContext.findOne).toHaveBeenCalledTimes(1);
            });
        });

        describe("Given the wallet does not exist", () => {
            it("should return null", async () => {
                modelContext.findOne.mockResolvedValue(null);
                const data = walletJson;
                const wallet = await walletRepo.getUnique(data);
                expect(wallet).toBeNull();
                expect(modelContext.findOne).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("Testing getBusinessRootWallet", () => {
        it("should return a wallet object for the business", async () => {
            modelContext.findOne.mockResolvedValue(walletObj);
            const wallet = await walletRepo.getBusinessRootWallet(
                walletData.businessId,
                walletData.currency
            );
            expect(wallet).toEqual(walletJson);
        });
    });

    describe("Testing addChargeScheme", () => {});
});
