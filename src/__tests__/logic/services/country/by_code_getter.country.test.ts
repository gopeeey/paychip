import { CountryByCodeGetter } from "../../../../logic/services";
import {
    CountryByCodeGetterDependenciesInterface,
    CountryRepoInterface,
} from "../../../../contracts/interfaces";
import { countryJson, countryData, standardCountry } from "../../../samples";
import { CountryNotFoundError } from "../../../../logic/errors";

const getByCodeMock = jest.fn();

const repo = {
    getByCode: getByCodeMock,
} as unknown as CountryRepoInterface;

const dependencies = {
    repo,
} as unknown as CountryByCodeGetterDependenciesInterface;

const getCountryByCode = new CountryByCodeGetter(dependencies).getByCode;

describe("Testing getCountryByCode", () => {
    describe("Given the country exists in the database", () => {
        it("should return a standard country object", async () => {
            getByCodeMock.mockResolvedValue(countryJson);
            const country = await getCountryByCode(countryData.isoCode);
            expect(country).toEqual(standardCountry);
            expect(getByCodeMock).toHaveBeenCalledTimes(1);
            expect(getByCodeMock).toHaveBeenCalledWith(countryData.isoCode);
        });
    });

    describe("Given the country does not exist in the database", () => {
        it("should throw a country not found error", async () => {
            getByCodeMock.mockResolvedValue(null);
            await expect(getCountryByCode("randomValue")).rejects.toThrow(
                new CountryNotFoundError()
            );
            expect(getByCodeMock).toHaveBeenCalledTimes(1);
            expect(getByCodeMock).toHaveBeenCalledWith("randomValue");
        });
    });
});
