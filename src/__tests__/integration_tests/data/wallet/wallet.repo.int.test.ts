import { Wallet, WalletRepo } from "@data/wallet";
import { getAWallet, walletSeeder } from "src/__tests__/samples";
import { DBSetup, SeedingError } from "src/__tests__/test_utils";
import { Business } from "@data/business";
import { Country } from "@data/country";
import { CreateWalletDto, GetUniqueWalletDto, IncrementBalanceDto } from "@logic/wallet";
import { StartSequelizeSession } from "@data/sequelize_session";

const testWalletRepo = new WalletRepo(Wallet);

DBSetup(walletSeeder);

// seed data

describe("TESTING WALLET REPO", () => {
    describe("Testing create", () => {
        it("should return a json wallet object", async () => {
            const session = await StartSequelizeSession();
            const business = await Business.findOne();
            if (!business) throw new SeedingError("business not found");
            const country = await Country.findByPk(business.countryCode);
            if (!country) throw new SeedingError("country not found");

            const data: CreateWalletDto = {
                businessId: business.id,
                currency: country.currencyCode,
                email: "new@wallet.com",
                walletType: "personal",
                parentWalletId: null,
                waiveFundingCharges: false,
                waiveWithdrawalCharges: false,
                waiveWalletInCharges: false,
                waiveWalletOutCharges: false,
            };
            const wallet = await testWalletRepo.create(data, session);
            await session.commit();

            const persistedWallet = await Wallet.findByPk(wallet.id);
            if (!persistedWallet) throw new Error("Wallet not persisted");

            expect(persistedWallet.toJSON()).toMatchObject(data);
        });
    });

    describe("Testing getById", () => {
        describe("Given the wallet exists", () => {
            it("should return a wallet json object", async () => {
                const existing = await Wallet.findOne();
                if (!existing) throw new SeedingError("wallet not found");
                const wallet = await testWalletRepo.getById(existing.id);
                if (!wallet) throw new Error("wallet not found");
                expect(existing).toMatchObject(wallet);
            });
        });

        describe("Given the wallet does not exist", () => {
            it("should return null", async () => {
                const wallet = await testWalletRepo.getById("lofi");
                expect(wallet).toBeNull();
            });
        });
    });

    describe("Testing getUnique", () => {
        describe("Given the wallet exists", () => {
            it("should return a wallet json object", async () => {
                const existing = await Wallet.findOne();
                if (!existing) throw new SeedingError("wallet not found");
                const data = new GetUniqueWalletDto(existing);
                const wallet = await testWalletRepo.getUnique(data);
                if (!wallet) throw new Error("Wallet not found");
                expect(wallet.id).toBeDefined();
                expect(existing).toMatchObject(wallet);
            });
        });

        describe("Given the wallet does not exist", () => {
            it("should return null", async () => {
                const wallet = await testWalletRepo.getUnique({
                    businessId: 987,
                    currency: "NGN",
                    email: "doesnt@exist.com",
                });
                expect(wallet).toBeNull();
            });
        });
    });

    describe("Testing getBusinessRootWallet", () => {
        it("should return a wallet object for the business", async () => {
            const existing = await Wallet.findOne({ where: { parentWalletId: null } });
            if (!existing) throw new SeedingError("root wallet not found");
            const wallet = await testWalletRepo.getBusinessRootWallet(
                existing.businessId,
                existing.currency
            );
            if (!wallet) throw new Error("wallet not found");
            expect(wallet.parentWalletId).toBeNull();
            expect(existing).toMatchObject(wallet);
        });
    });

    describe("Testing incrementBalance", () => {
        it("should increment the balance of the wallet by the provided amount", async () => {
            const amounts = [20, 2000, -4, -4000, -1.5, -23.34, 2.4];
            for (const amount of amounts) {
                const wallet = await getAWallet();
                const session = await StartSequelizeSession();
                const incrementDto = new IncrementBalanceDto({
                    walletId: wallet.id,
                    amount,
                    session,
                });
                await testWalletRepo.incrementBalance(incrementDto);
                await session.commit();

                const newWallet = await Wallet.findByPk(wallet.id);
                if (!newWallet) throw new SeedingError("Wallet not found");
                expect(newWallet.balance - wallet.balance).toBe(Math.round(amount));
            }
        });
    });
});
