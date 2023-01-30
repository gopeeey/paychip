import { CreateCountryDto, StandardCountryDto } from "../../../../dtos";
import { CountryRepoInterface } from "../../../db";
import { CountryByCodeGetterInterface } from "./by_code_getter.country.interface";

export interface CountryServiceInterface {
    create: (dto: CreateCountryDto) => Promise<StandardCountryDto>;
    getByCode: (isoCode: string) => Promise<StandardCountryDto | null>;
    getSupportedCountries: () => Promise<StandardCountryDto[]>;
    getSupportedCountryCodes: () => Promise<StandardCountryDto["isoCode"][]>;
}

export interface CountryServiceDependenciesInterface {
    repo: CountryRepoInterface;
    getCountryByCode: CountryByCodeGetterInterface["getByCode"];
}
