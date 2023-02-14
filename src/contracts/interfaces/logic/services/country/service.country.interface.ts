import { CreateCountryDto, StandardCountryDto } from "../../../../dtos";
import { CountryModelInterface, CountryRepoInterface } from "../../../db";

export interface CountryServiceInterface {
    create: (dto: CreateCountryDto) => Promise<CountryModelInterface>;
    getByCode: (isoCode: string) => Promise<CountryModelInterface>;
    getSupportedCountries: () => Promise<CountryModelInterface[]>;
    getSupportedCountryCodes: () => Promise<CountryModelInterface["isoCode"][]>;
}

export interface CountryServiceDependenciesInterface {
    repo: CountryRepoInterface;
}
