import { CountryRepo } from "@country/data";
import { runQuery } from "@data/db";
import { CountryModelInterface, CreateCountryDto } from "@country/logic";
import SQL from "sql-template-strings";
import { countrySeeder, getACountry, getACurrency } from "src/__tests__/samples";
import { DBSetup } from "src/__tests__/test_utils";

const pool = DBSetup(countrySeeder);

const countryRepo = new CountryRepo(pool);

describe("Testing country repo", () => {
    describe("Testing create", () => {
        it("should return a country object", async () => {
            const currency = await getACurrency(pool);
            const data = new CreateCountryDto({
                currencyCode: currency.isoCode,
                name: "Nigeria",
                isoCode: "NGI",
            });
            const country = await countryRepo.create(data);
            expect(country).toBeDefined();
            const refRes = await runQuery<CountryModelInterface>(
                SQL`SELECT * FROM countries WHERE "isoCode" = 'NGI';`,
                pool
            );
            const savedCountry = refRes.rows[0];
            if (!savedCountry) throw new Error("Failed to persist country");
            expect(country).toMatchObject(savedCountry);
        });
    });

    describe("Testing getByCode", () => {
        describe("Given the country exists in the database", () => {
            it("should return the country object", async () => {
                const existingCountry = await getACountry(pool);
                const country = await countryRepo.getByCode(existingCountry.isoCode);
                if (!country) throw new Error("Country not found");
                expect(country).toBeDefined();
                expect(country).toMatchObject(existingCountry);
            });
        });

        describe("Given the country doesn't exists", () => {
            it("should return null", async () => {
                const country = await countryRepo.getByCode("MGM");
                expect(country).toBe(null);
            });
        });
    });

    describe("Testing getAll", () => {
        it("should return an array of supported countries", async () => {
            const res = await runQuery<CountryModelInterface>(SQL`SELECT * FROM countries;`, pool);
            const existingCountries = res.rows;
            const countries = await countryRepo.getAll();
            expect(countries).toEqual(existingCountries);
        });
    });
});
