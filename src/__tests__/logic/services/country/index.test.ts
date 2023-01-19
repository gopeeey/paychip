import { CountryService } from "../../../../logic/services";
import { CountryRepoInterface } from "../../../../contracts/interfaces/db_logic";
import {
    countryData,
    countryJson,
    countryJsonArray,
    standardCountry,
    standardCountryArray,
} from "../../../samples";
import { CountryNotFoundError } from "../../../../logic/errors";

const createMock = jest.fn();
const getByCodeMock = jest.fn();
const getAllMock = jest.fn();

const repo = {
    create: createMock,
    getByCode: getByCodeMock,
    getAll: getAllMock,
} as unknown as CountryRepoInterface;

const countryService = new CountryService(repo);

describe("Testing country service", () => {
    describe("Testing create", () => {
        it("should return a standard country object", async () => {
            createMock.mockResolvedValue(countryJson);
            const country = await countryService.create(countryData);
            expect(country).toEqual(standardCountry);
        });
    });

    describe("Testing getByCode", () => {
        describe("Given the country exists in the database", () => {
            it("should return a standard country object", async () => {
                getByCodeMock.mockResolvedValue(countryJson);
                const country = await countryService.getByCode(countryData.isoCode);
                expect(country).toEqual(standardCountry);
            });
        });

        describe("Given the country does not exist in the database", () => {
            it("should throw a country not found error", async () => {
                getByCodeMock.mockResolvedValue(null);
                await expect(countryService.getByCode("randomValue")).rejects.toThrow(
                    new CountryNotFoundError()
                );
            });
        });
    });

    describe("Testing getSupportedCountries", () => {
        it("should return an array of standard countries", async () => {
            getAllMock.mockResolvedValue(countryJsonArray);
            const countries = await countryService.getSupportedCountries();
            expect(countries).toEqual(standardCountryArray);
        });
    });

    describe("Testing getSupportedCountryCodes", () => {
        it("should return an array of country codes", async () => {
            getAllMock.mockResolvedValue(countryJsonArray);
            const countryCodes = await countryService.getSupportedCountryCodes();
            expect(countryCodes).toEqual(countryCodes);
        });
    });
});
