import { runAssociations } from "@data/associations";
import { CountryRepo, Country } from "@data/country";
import { CreateCountryDto } from "@logic/country";
import {
    countryObj,
    countryJson,
    countryData,
    countryObjArray,
    countryJsonArray,
    countrySeeder,
} from "src/__tests__/samples";
import { DBSetup } from "src/__tests__/test_utils";

const modelContext = {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
};

const countryRepo = new CountryRepo(modelContext as unknown as typeof Country);

const testCountryRepo = new CountryRepo(Country);

DBSetup(countrySeeder);

describe("Testing country repo", () => {
    describe("Testing create", () => {
        it("should return a country object", async () => {
            const createMock = jest.spyOn(testCountryRepo, "create");
            const data = new CreateCountryDto({
                currencyCode: "NGN",
                name: "Nigeria",
                isoCode: "NGI",
            });
            const country = await testCountryRepo.create(data);
            expect(country).toBeDefined();
            expect(country.name).toBe(data.name);
            expect(country.isoCode).toBe(data.isoCode);
            expect(createMock).toHaveBeenCalledTimes(1);
            expect(createMock).toHaveBeenCalledWith(data);
        });
    });

    describe("Testing getByCode", () => {
        describe("Given the country exists in the database", () => {
            it("should return the country object", async () => {
                const existingCountry = await Country.findOne();
                if (!existingCountry) throw new Error("Failed to seed countries");
                const country = await testCountryRepo.getByCode(existingCountry.isoCode);
                if (!country) throw new Error("Country not found");
                expect(country).toBeDefined();
                expect(country.name).toBe(existingCountry.name);
                expect(country.isoCode).toBe(existingCountry.isoCode);
                expect(country.currencyCode).toBe(existingCountry.currencyCode);
            });
        });

        describe("Given the country doesn't exists", () => {
            it("should return null", async () => {
                const country = await testCountryRepo.getByCode("MGM");
                expect(country).toBe(null);
            });
        });
    });

    describe("Testing getAll", () => {
        it("should return an array of supported countries", async () => {
            const existingCountries = await Country.findAll();
            const existingJsons = existingCountries.map((cou) => cou.toJSON());
            const countries = await testCountryRepo.getAll();
            expect(countries).toEqual(existingJsons);
        });
    });
});
