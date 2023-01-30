import { StandardCountryDto } from "../../../../dtos";
import { CountryModelInterface, CountryRepoInterface } from "../../../db";

export interface CountryByCodeGetterInterface {
    getByCode: (isoCode: CountryModelInterface["isoCode"]) => Promise<StandardCountryDto>;
}

export interface CountryByCodeGetterDependenciesInterface {
    repo: CountryRepoInterface;
}
