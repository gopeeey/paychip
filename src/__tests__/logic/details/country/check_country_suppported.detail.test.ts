import { checkCountrySupported } from "../../../../logic/details";
import * as countryDetails from "../../../../logic/details/country";
import { CountryRepoInterface } from "../../../../contracts/interfaces";
import { countryJson, countryData, standardCountry } from "../../../samples";
import { CountryNotFoundError } from "../../../../logic/errors";

const repo = { getByCode: jest.fn() } as unknown as CountryRepoInterface;
const getCountryByCodeMock = jest.spyOn(countryDetails, "getCountryByCode");

describe("Testing ValidateCountry", () => {
    describe("Given a supported country", () => {
        it("should return true", async () => {
            getCountryByCodeMock.mockResolvedValue(standardCountry);
            const response = await checkCountrySupported(repo, countryData.isoCode);
            expect(response).toBe(true);
            expect(getCountryByCodeMock).toHaveBeenCalledTimes(1);
            expect(getCountryByCodeMock).toHaveBeenCalledWith(countryData.isoCode);
        });
    });

    describe("Given an unsupported country", () => {
        it("should return false", async () => {
            getCountryByCodeMock.mockRejectedValue(new CountryNotFoundError());
            const response = await checkCountrySupported(repo, countryData.isoCode);
            expect(response).toBe(false);
            expect(getCountryByCodeMock).toHaveBeenCalledTimes(1);
            expect(getCountryByCodeMock).toHaveBeenCalledWith(countryData.isoCode);
        });
    });
});
