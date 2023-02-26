import { CreateCountryDto } from "../dtos";
import { CountryModelInterface } from "./country.model.interface";
import { CountryRepoInterface } from "./country.repo.interface";

export interface CountryServiceInterface {
    create: (dto: CreateCountryDto) => Promise<CountryModelInterface>;
    getByCode: (isoCode: string) => Promise<CountryModelInterface>;
    getSupportedCountries: () => Promise<CountryModelInterface[]>;
    getSupportedCountryCodes: () => Promise<CountryModelInterface["isoCode"][]>;
}

export interface CountryServiceDependenciesInterface {
    repo: CountryRepoInterface;
}
