import { CreateCountryDto, StandardCountryDto } from "../../../dtos";

export interface CountryServiceInterface {
    create: (dto: CreateCountryDto) => Promise<StandardCountryDto>;
    getByCode: (isoCode: string) => Promise<StandardCountryDto | null>;
    getSupportedCountries: () => Promise<StandardCountryDto[]>;
    getSupportedCountryCodes: () => Promise<StandardCountryDto["isoCode"][]>;
}
