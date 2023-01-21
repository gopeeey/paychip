import { CheckCountrySupportedType, CountryRepoInterface } from "../../../contracts/interfaces";
import { CountryNotFoundError } from "../../errors";
import { getCountryByCode } from "./get_country_by_code.detail";

export const checkCountrySupported: CheckCountrySupportedType = async (
    repo: CountryRepoInterface,
    isoCode: string
) => {
    try {
        await getCountryByCode(repo, isoCode);
        return true;
    } catch (err) {
        if (err instanceof CountryNotFoundError) return false;
        throw err;
    }
};
