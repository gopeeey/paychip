import { CountryService } from "../../../../logic/services";
import {
    CountryRepoInterface,
    CountryServiceDependenciesInterface,
} from "../../../../contracts/interfaces";
import {
    countryData,
    countryJson,
    countryJsonArray,
    standardCountry,
    standardCountryArray,
} from "../../../samples";

const repo = {
    create: jest.fn(),
    getByCode: jest.fn(),
    getAll: jest.fn(),
};

const dependencies = { repo: repo as CountryRepoInterface };

const countryService = new CountryService(
    dependencies as unknown as CountryServiceDependenciesInterface
);

describe("Testing country service", () => {
    describe("Testing create", () => {
        it("should return a standard country object", async () => {
            repo.create.mockResolvedValue(countryJson);
            const country = await countryService.create(countryData);
            expect(country).toEqual(standardCountry);
            expect(repo.create).toHaveBeenCalledTimes(1);
            expect(repo.create).toHaveBeenCalledWith(countryData);
        });
    });

    describe("Testing getByCode", () => {
        describe("Given country exists", () => {
            it("should return a standard country object", async () => {
                repo.getByCode.mockResolvedValue(countryJson);
                const result = await countryService.getByCode(countryData.currencyCode);
                expect(result).toBe(standardCountry);
                expect(repo.getByCode).toHaveBeenCalledTimes(1);
                expect(repo.getByCode).toHaveBeenCalledWith(countryData.currencyCode);
            });
        });

        describe("Given country does not exist", () => {
            it("should return null", async () => {
                repo.getByCode.mockResolvedValue(null);
                const result = await countryService.getByCode(countryData.currencyCode);
                expect(result).toBe(null);
                expect(repo.getByCode).toHaveBeenCalledTimes(1);
                expect(repo.getByCode).toHaveBeenCalledWith(countryData.currencyCode);
            });
        });
    });

    describe("Testing getSupportedCountries", () => {
        it("should return an array of standard countries", async () => {
            repo.getAll.mockResolvedValue(countryJsonArray);
            const countries = await countryService.getSupportedCountries();
            expect(countries).toEqual(standardCountryArray);
            expect(repo.getAll).toHaveBeenCalledTimes(1);
        });
    });

    describe("Testing getSupportedCountryCodes", () => {
        it("should return an array of country codes", async () => {
            repo.getAll.mockResolvedValue(countryJsonArray);
            const countryCodes = await countryService.getSupportedCountryCodes();
            expect(countryCodes).toEqual(countryCodes);
            expect(repo.getAll).toHaveBeenCalledTimes(1);
        });
    });

    describe("Testing checkCountryIsSupported", () => {
        describe("Given country is supported", () => {
            it("should return true", async () => {
                repo.getByCode.mockResolvedValue(countryJson);
                const result = await countryService.checkCountryIsSupported(
                    countryData.currencyCode
                );
                expect(result).toBe(true);
                expect(repo.getByCode).toHaveBeenCalledTimes(1);
                expect(repo.getByCode).toHaveBeenCalledWith(countryData.currencyCode);
            });
        });

        describe("Given country is not supported", () => {
            it("should return false", async () => {
                repo.getByCode.mockResolvedValue(null);
                const result = await countryService.checkCountryIsSupported(
                    countryData.currencyCode
                );
                expect(result).toBe(false);
                expect(repo.getByCode).toHaveBeenCalledTimes(1);
                expect(repo.getByCode).toHaveBeenCalledWith(countryData.currencyCode);
            });
        });
    });
});
