import { CurrencyRepo, Currency, BusinessCurrency } from "@data/currency";
import { currencySeeder } from "src/__tests__/samples";
import { DBSetup } from "src/__tests__/test_utils";

const currencyRepo = new CurrencyRepo();

DBSetup(currencySeeder);

describe("TESTING CURRENCY REPO", () => {
    describe("Testing getAll", () => {
        it("should return an array of currencyJson objects", async () => {
            const expected = await Currency.findAll();
            const currencies = await currencyRepo.getAll();
            expect(currencies).toEqual(expected.map((ex) => ex.toJSON()));
        });
    });

    describe("Testing getActive", () => {
        it("should return an array of active currency json objects", async () => {
            const expected = await Currency.findAll({ where: { active: true } });
            const currencies = await currencyRepo.getActive();
            expect(currencies).toEqual(expected.map((ex) => ex.toJSON()));
        });
    });
});
