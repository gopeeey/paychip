import { CreateCountryDto, StandardCountryDto } from "../../../../dtos";
import { CountryModelInterface, CountryRepoInterface } from "../../../db";

export interface CountryServiceInterface {
    create: (dto: CreateCountryDto) => Promise<StandardCountryDto>;
    getByCode: (isoCode: string) => Promise<StandardCountryDto | null>;
    getSupportedCountries: () => Promise<StandardCountryDto[]>;
    getSupportedCountryCodes: () => Promise<StandardCountryDto["isoCode"][]>;
    checkCountryIsSupported: (isoCode: CountryModelInterface["isoCode"]) => Promise<boolean>;
}

export interface CountryServiceDependenciesInterface {
    repo: CountryRepoInterface;
}
