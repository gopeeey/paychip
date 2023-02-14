import { CreateCountryDto, StandardCountryDto } from "../../../../dtos";
import { CountryModelInterface, CountryRepoInterface } from "../../../db";

export interface CountryServiceInterface {
    create: (dto: CreateCountryDto) => Promise<StandardCountryDto>;
    getByCode: (isoCode: string) => Promise<StandardCountryDto>;
    getSupportedCountries: () => Promise<StandardCountryDto[]>;
    getSupportedCountryCodes: () => Promise<StandardCountryDto["isoCode"][]>;
}

export interface CountryServiceDependenciesInterface {
    repo: CountryRepoInterface;
}
