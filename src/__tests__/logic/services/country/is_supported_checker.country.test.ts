import { CountrySupportedChecker } from "../../../../logic/services";
import { CountrySupportedCheckerDependenciesInterface } from "../../../../contracts/interfaces";
import { countryJson, countryData, standardCountry } from "../../../samples";
import { CountryNotFoundError } from "../../../../logic/errors";

const getCountryByCodeMock = jest.fn();
const dependencies = {
    getCountryByCode: getCountryByCodeMock,
} as unknown as CountrySupportedCheckerDependenciesInterface;

const checkCountrySupported = new CountrySupportedChecker(dependencies).check;

describe("Testing ValidateCountry", () => {
    describe("Given a supported country", () => {
        it("should return true", async () => {
            getCountryByCodeMock.mockResolvedValue(standardCountry);
            const response = await checkCountrySupported(countryData.isoCode);
            expect(response).toBe(true);
            expect(getCountryByCodeMock).toHaveBeenCalledTimes(1);
            expect(getCountryByCodeMock).toHaveBeenCalledWith(countryData.isoCode);
        });
    });

    describe("Given an unsupported country", () => {
        it("should return false", async () => {
            getCountryByCodeMock.mockRejectedValue(new CountryNotFoundError());
            const response = await checkCountrySupported(countryData.isoCode);
            expect(response).toBe(false);
            expect(getCountryByCodeMock).toHaveBeenCalledTimes(1);
            expect(getCountryByCodeMock).toHaveBeenCalledWith(countryData.isoCode);
        });
    });
});
