import { CountryModelInterface } from "../../../db";
import { CountryByCodeGetterInterface } from "./by_code_getter.country.interface";

export interface CountrySupportedCheckerInterface {
    check: (isoCode: CountryModelInterface["isoCode"]) => Promise<boolean>;
}

export interface CountrySupportedCheckerDependenciesInterface {
    getCountryByCode: CountryByCodeGetterInterface["getByCode"];
}
