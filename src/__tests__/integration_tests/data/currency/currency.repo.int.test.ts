import { CurrencyRepo } from "@data/currency";
import { runQuery } from "@data/db";
import { CurrencyModelInterface } from "@logic/currency";
import { currencySeeder } from "src/__tests__/samples";
import { DBSetup } from "src/__tests__/test_utils";

const pool = DBSetup(currencySeeder);

const currencyRepo = new CurrencyRepo(pool);

describe("TESTING CURRENCY REPO", () => {
    describe("Testing getAll", () => {
        it("should return an array of currencyJson objects", async () => {
            const res = await runQuery<CurrencyModelInterface>("SELECT * FROM currencies", pool);
            const expected = res.rows;
            const currencies = await currencyRepo.getAll();
            expect(currencies).toEqual(expected);
        });
    });

    describe("Testing getActive", () => {
        it("should return an array of active currency json objects", async () => {
            const res = await runQuery<CurrencyModelInterface>(
                "SELECT * FROM currencies WHERE active = true",
                pool
            );
            const expected = res.rows;
            const currencies = await currencyRepo.getActive();
            expect(currencies).toEqual(expected);
        });
    });
});
