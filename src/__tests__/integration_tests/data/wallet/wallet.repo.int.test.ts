import { WalletRepo } from "@data/wallet";
import {
    getABusiness,
    getABusinessWalletByBusinessId,
    getACountry,
    getAWallet,
    walletSeeder,
} from "src/__tests__/samples";
import { DBSetup } from "src/__tests__/test_utils";
import {
    CreateWalletDto,
    GetUniqueWalletDto,
    IncrementBalanceDto,
    WalletModelInterface,
} from "@logic/wallet";
import { runQuery } from "@data/db";
import SQL from "sql-template-strings";

// seed data
const pool = DBSetup(walletSeeder);

const walletRepo = new WalletRepo(pool);

describe("TESTING WALLET REPO", () => {
    describe("Testing create", () => {
        it("should persist and return the wallet", async () => {
            const business = await getABusiness(pool);
            const bw = await getABusinessWalletByBusinessId(pool, business.id);
            const country = await getACountry(pool, business.countryCode);

            const data = new CreateWalletDto({
                businessId: business.id,
                currency: country.currencyCode,
                email: "new@wallet.com",
                businessWalletId: bw.id,
                waiveFundingCharges: false,
                waiveWithdrawalCharges: false,
                waiveWalletInCharges: false,
                waiveWalletOutCharges: false,
            });

            const session = await walletRepo.startSession();
            const wallet = await walletRepo.create(data, session);
            await session.commit();

            if (!wallet) throw new Error("Did not return wallet");
            const res = await runQuery<WalletModelInterface>(
                SQL`SELECT * FROM "wallets" WHERE "id" = ${wallet.id}`,
                pool
            );
            const persisted = res.rows[0];
            if (!persisted) throw new Error("Failed to persist wallet");
            expect(wallet).toMatchObject(persisted);
        });
    });

    describe("Testing getById", () => {
        describe("Given the wallet exists", () => {
            it("should return a wallet json object", async () => {
                const existing = await getAWallet(pool);
                const wallet = await walletRepo.getById(existing.id);
                if (!wallet) throw new Error("wallet not found");
                expect(wallet).toMatchObject(existing);
            });
        });

        describe("Given the wallet does not exist", () => {
            it("should return null", async () => {
                const wallet = await walletRepo.getById("lofi");
                expect(wallet).toBeNull();
            });
        });
    });

    describe("Testing getUnique", () => {
        describe("Given the wallet exists", () => {
            it("should return a wallet json object", async () => {
                const existing = await getAWallet(pool);
                const data = new GetUniqueWalletDto(existing);
                const wallet = await walletRepo.getUnique(data);
                if (!wallet) throw new Error("Wallet not found");
                expect(wallet).toMatchObject(existing);
            });
        });

        describe("Given the wallet does not exist", () => {
            it("should return null", async () => {
                const wallet = await walletRepo.getUnique({
                    businessId: 987,
                    currency: "NGN",
                    email: "doesnt@exist.com",
                });
                expect(wallet).toBeNull();
            });
        });
    });

    describe("Testing incrementBalance", () => {
        it("should increment the balance of the wallet by the provided amount", async () => {
            const amounts = [20, 2000, -4, -4000, -1, -23, 2];
            for (const amount of amounts) {
                const wallet = await getAWallet(pool);
                const session = await walletRepo.startSession();
                const incrementDto = new IncrementBalanceDto({
                    walletId: wallet.id,
                    amount,
                    session,
                });
                await walletRepo.incrementBalance(incrementDto);
                await session.commit();

                const newWallet = await getAWallet(pool, wallet.id);
                expect(newWallet.balance - wallet.balance).toBe(Math.round(amount));
            }
        });
    });
});
