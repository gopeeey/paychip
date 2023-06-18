import { BusinessWalletRepo, DbBusinessWallet } from "@business_wallet/data";
import { runQuery } from "@data/db";
import { BusinessWalletModelInterface, CreateBusinessWalletDto } from "@business_wallet/logic";
import { ChargeDto } from "@charges/logic";
import SQL from "sql-template-strings";
import { getABusiness, getACountry, getACurrency } from "src/__tests__/samples";
import { bwSeeder, getABusinessWallet } from "src/__tests__/samples/business_wallet.samples";
import { DBSetup } from "src/__tests__/test_utils";

const pool = DBSetup(bwSeeder);

const bwRepo = new BusinessWalletRepo(pool);

const getBC = async () => {
    const business = await getABusiness(pool);
    const country = await getACountry(pool, business.countryCode);
    const currency = await getACurrency(pool, country.currencyCode);

    return { business, currency };
};

describe("TESTING BUSINESS WALLET REPO", () => {
    describe("Testing parseChargeStack", () => {
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

            const data: DbBusinessWallet = {
                id: "something",
                businessId: 1,
                currencyCode: "NGN",
                balance: 0,
                customFundingCs: stringStack,
                customWithdrawalCs: stringStack,
                customWalletInCs: stringStack,
                customWalletOutCs: stringStack,
                fundingChargesPaidBy: "wallet",
                withdrawalChargesPaidBy: "wallet",
                w_fundingCs: stringStack,
                w_withdrawalCs: stringStack,
                w_walletInCs: stringStack,
                w_walletOutCs: stringStack,
                w_fundingChargesPaidBy: "wallet",
                w_withdrawalChargesPaidBy: "wallet",
            };

            const result = bwRepo.parseBusinessWallet(data);
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

    describe("Testing create", () => {
        it("should create a new business wallet row in the db and return the data", async () => {
            const { business, currency } = await getBC();
            const dto = new CreateBusinessWalletDto({
                businessId: business.id,
                currencyCode: currency.isoCode,
            });
            const session = await bwRepo.startSession();
            const bw = await bwRepo.create(dto, session);
            await session.commit();
            if (!bw) throw new Error("Failed to persist business wallet");
            const res = await runQuery<BusinessWalletModelInterface>(
                SQL`SELECT * FROM "businessWallets" WHERE id = ${bw.id}`,
                pool
            );
            const persisted = res.rows[0];
            if (!persisted) throw new Error("Failed to persist business wallet");
            expect(persisted).toMatchObject(dto);
            expect(persisted.id.endsWith(business.id.toString())).toBe(true);
        });
    });

    describe("Testing getByCurrency", () => {
        describe("Given the wallet exists", () => {
            it("should return a wallet object", async () => {
                const existing = await getABusinessWallet(pool);
                delete existing.createdAt;
                const bw = await bwRepo.getByCurrency(existing.businessId, existing.currencyCode);
                expect(bw).toMatchObject(existing);
            });
        });

        describe("Given the wallet does not exist", () => {
            it("should return null", async () => {
                const bw = await bwRepo.getByCurrency(33333, "GHN");
                expect(bw).toBeNull();
            });
        });
    });
});
