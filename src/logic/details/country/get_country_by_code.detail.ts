import { StandardCountryDto } from "../../../contracts/dtos";
import {
    CountryModelInterface,
    CountryRepoInterface,
    GetCountryByCodeType,
} from "../../../contracts/interfaces";
import { CountryNotFoundError } from "../../errors";

export const getCountryByCode: GetCountryByCodeType = async (
    repo: CountryRepoInterface,
    isoCode: CountryModelInterface["isoCode"]
) => {
    const country = await repo.getByCode(isoCode);
    if (!country) throw new CountryNotFoundError();
    return new StandardCountryDto(country);
};
