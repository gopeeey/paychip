import {
    CountryService,
    CountryRepoInterface,
    CountryServiceDependenciesInterface,
    CountryNotFoundError,
} from "@logic/country";
import { countryData, countryJson, countryJsonArray } from "src/__tests__/samples";

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
            expect(country).toEqual(countryJson);
            expect(repo.create).toHaveBeenCalledTimes(1);
            expect(repo.create).toHaveBeenCalledWith(countryData);
        });
    });

    describe("Testing getByCode", () => {
        describe("Given country exists", () => {
            it("should return a standard country object", async () => {
                repo.getByCode.mockResolvedValue(countryJson);
                const result = await countryService.getByCode(countryJson.isoCode);
                expect(result).toEqual(countryJson);
                expect(repo.getByCode).toHaveBeenCalledTimes(1);
                expect(repo.getByCode).toHaveBeenCalledWith(countryJson.isoCode);
            });
        });

        describe("Given country does not exist", () => {
            it("should throw a country not found error", async () => {
                repo.getByCode.mockResolvedValue(null);
                await expect(countryService.getByCode(countryJson.isoCode)).rejects.toThrow(
                    new CountryNotFoundError()
                );
                expect(repo.getByCode).toHaveBeenCalledTimes(1);
                expect(repo.getByCode).toHaveBeenCalledWith(countryJson.isoCode);
            });
        });
    });

    describe("Testing getSupportedCountries", () => {
        it("should return an array of standard countries", async () => {
            repo.getAll.mockResolvedValue(countryJsonArray);
            const countries = await countryService.getSupportedCountries();
            expect(countries).toEqual(countryJsonArray);
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
});
