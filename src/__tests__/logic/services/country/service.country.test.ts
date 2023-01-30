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

const createMock = jest.fn();
const getByCodeMock = jest.fn();
const getAllMock = jest.fn();

const repo = {
    create: createMock,
    getByCode: getByCodeMock,
    getAll: getAllMock,
} as unknown as CountryRepoInterface;

const getCountryByCodeMock = jest.fn();
const checkCountrySupportedMock = jest.fn();
const dependencies = {
    repo,
    getCountryByCode: getCountryByCodeMock,
    checkCountrySupported: checkCountrySupportedMock,
} as unknown as CountryServiceDependenciesInterface;

const countryService = new CountryService(dependencies);

describe("Testing country service", () => {
    describe("Testing create", () => {
        it("should return a standard country object", async () => {
            createMock.mockResolvedValue(countryJson);
            const country = await countryService.create(countryData);
            expect(country).toEqual(standardCountry);
            expect(createMock).toHaveBeenCalledTimes(1);
            expect(createMock).toHaveBeenCalledWith(countryData);
        });
    });

    describe("Testing getSupportedCountries", () => {
        it("should return an array of standard countries", async () => {
            getAllMock.mockResolvedValue(countryJsonArray);
            const countries = await countryService.getSupportedCountries();
            expect(countries).toEqual(standardCountryArray);
            expect(getAllMock).toHaveBeenCalledTimes(1);
        });
    });

    describe("Testing getSupportedCountryCodes", () => {
        it("should return an array of country codes", async () => {
            getAllMock.mockResolvedValue(countryJsonArray);
            const countryCodes = await countryService.getSupportedCountryCodes();
            expect(countryCodes).toEqual(countryCodes);
            expect(getAllMock).toHaveBeenCalledTimes(1);
        });
    });
});
