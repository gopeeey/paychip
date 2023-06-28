import { DbWallet, WalletRepo } from "@wallet/data";
import {
    getABusiness,
    getABusinessWallet,
    getABusinessWalletByBusinessId,
    getACountry,
    getACurrency,
    getAWallet,
    walletSeeder,
} from "src/__tests__/helpers/samples";
import { DBSetup } from "src/__tests__/helpers/test_utils";
import {
    CreateWalletDto,
    GetUniqueWalletDto,
    IncrementBalanceDto,
    WalletModelInterface,
} from "@wallet/logic";
import { runQuery } from "@db/postgres";
import SQL from "sql-template-strings";
import { ChargeDto } from "@charges/logic";

// seed data
const pool = DBSetup(walletSeeder);

const walletRepo = new WalletRepo(pool);

const getBC = async () => {
    const business = await getABusiness(pool);
    const country = await getACountry(pool, business.countryCode);
    const currency = await getACurrency(pool, country.currencyCode);

    return { business, currency };
};

describe("TESTING WALLET REPO", () => {
    describe(">>> create", () => {
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
            await session.end();

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

    describe(">>> parseWallet", () => {
        it("should return a parsed business wallet", () => {
            const chargeStack = [
                new ChargeDto({
                    flatCharge: 200,
                    percentageCharge: 20,
                    minimumPrincipalAmount: 2000,
                    percentageChargeCap: 20000,
                }),
            ];

            const stringStack = JSON.stringify(chargeStack);

            const data: DbWallet = {
                id: "something",
                businessId: 1,
                businessWalletId: null,
                active: true,
                email: "maniac@song.com",
                isBusinessWallet: true,
                waiveFundingCharges: false,
                waiveWalletInCharges: false,
                waiveWalletOutCharges: false,
                waiveWithdrawalCharges: false,
                currency: "NGN",
                balance: 0,
                customFundingCs: stringStack,
                customWithdrawalCs: stringStack,
                customWalletInCs: stringStack,
                customWalletOutCs: stringStack,
                w_fundingCs: stringStack,
                w_withdrawalCs: stringStack,
                w_walletInCs: stringStack,
                w_walletOutCs: stringStack,
                w_fundingChargesPaidBy: "wallet",
                w_withdrawalChargesPaidBy: "wallet",
            };

            const result = walletRepo.parseWallet(data);
            const expected = {
                ...data,
                customFundingCs: chargeStack,
                customWithdrawalCs: chargeStack,
                customWalletInCs: chargeStack,
                customWalletOutCs: chargeStack,
                w_fundingCs: chargeStack,
                w_withdrawalCs: chargeStack,
                w_walletInCs: chargeStack,
                w_walletOutCs: chargeStack,
            };
            expect(expected).toMatchObject(result);
        });
    });

    describe(">>> getById", () => {
        describe("Given the wallet exists", () => {
            it("should return a wallet json object", async () => {
                const existing = await getAWallet(pool);
                const parsed = walletRepo.parseWallet(existing);
                const wallet = await walletRepo.getById(existing.id);
                if (!wallet) throw new Error("wallet not found");
                expect(wallet).toMatchObject(parsed);
            });
        });

        describe("Given the wallet does not exist", () => {
            it("should return null", async () => {
                const wallet = await walletRepo.getById("lofi");
                expect(wallet).toBeNull();
            });
        });
    });

    describe(">>> getUnique", () => {
        describe("Given the wallet exists", () => {
            it("should return a wallet json object", async () => {
                const existing = await getAWallet(pool);
                const parsed = walletRepo.parseWallet(existing);
                const data = new GetUniqueWalletDto(existing);
                const wallet = await walletRepo.getUnique(data);
                if (!wallet) throw new Error("Wallet not found");
                expect(wallet).toMatchObject(parsed);
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

    describe(">>> getBusinessWalletByCurrency", () => {
        describe("Given the wallet exists", () => {
            it("should return a wallet object", async () => {
                const existing = await getABusinessWallet(pool);
                const bw = await walletRepo.getBusinessWalletByCurrency(
                    existing.businessId,
                    existing.currency
                );
                expect(bw).toMatchObject(existing);
            });
        });

        describe("Given the wallet does not exist", () => {
            it("should return null", async () => {
                const bw = await walletRepo.getBusinessWalletByCurrency(33333, "GHN");
                expect(bw).toBeNull();
            });
        });
    });

    describe(">>> incrementBalance", () => {
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
                await session.end();

                const newWallet = await getAWallet(pool, wallet.id);
                expect(newWallet.balance - wallet.balance).toBe(Math.round(amount));
            }
        });
    });
});
