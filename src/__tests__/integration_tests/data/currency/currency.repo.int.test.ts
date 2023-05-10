import { CurrencyRepo, DbCurrency } from "@data/currency";
import { runQuery } from "@data/db";
import { ChargeDto } from "@logic/charges";
import { CurrencyModelInterface } from "@logic/currency";
import { currencySeeder } from "src/__tests__/samples";
import { DBSetup } from "src/__tests__/test_utils";

const pool = DBSetup(currencySeeder);

const currencyRepo = new CurrencyRepo(pool);

describe("TESTING CURRENCY REPO", () => {
    describe("Testing parseChargeStack", () => {
        it("should return a currency object with the charge stacks parsed", () => {
            const chargeStack = [
                new ChargeDto({
                    flatCharge: 200,
                    percentageCharge: 20,
                    minimumPrincipalAmount: 2000,
                    percentageChargeCap: 20000,
                }),
            ];
            const stringStack = JSON.stringify(chargeStack);
            const data: DbCurrency = {
                isoCode: "NGN",
                name: "Naira",
                active: true,
                fundingCs: stringStack,
                withdrawalCs: stringStack,
                walletInCs: stringStack,
                walletOutCs: stringStack,
            };

            const result = currencyRepo.parseCurrency(data);
            const expected = {
                ...data,
                fundingCs: chargeStack,
                withdrawalCs: chargeStack,
                walletInCs: chargeStack,
                walletOutCs: chargeStack,
            };
            expect(expected).toMatchObject(result);
        });
    });

    describe("Testing getAll", () => {
        it("should return an array of currencyJson objects", async () => {
            const res = await runQuery<DbCurrency>("SELECT * FROM currencies", pool);
            const expected = res.rows.map((row) => currencyRepo.parseCurrency(row));
            const currencies = await currencyRepo.getAll();
            expect(currencies).toEqual(expected);
        });
    });

    describe("Testing getActive", () => {
        it("should return an array of active currency json objects", async () => {
            const res = await runQuery<DbCurrency>(
                "SELECT * FROM currencies WHERE active = true",
                pool
            );
            const expected = res.rows.map((row) => currencyRepo.parseCurrency(row));
            const currencies = await currencyRepo.getActive();
            expect(currencies).toEqual(expected);
        });
    });
});
