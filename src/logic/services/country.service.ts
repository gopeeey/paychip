import { CreateCountryDto, StandardCountryDto } from "../../contracts/dtos";
import {
    CountryRepoInterface,
    CountryServiceInterface,
    CountryDetails,
} from "../../contracts/interfaces";
import { CountryNotFoundError } from "../errors";

export class CountryService implements CountryServiceInterface {
    constructor(
        private readonly _repository: CountryRepoInterface,
        private readonly _details: CountryDetails
    ) {}

    async create(dto: CreateCountryDto) {
        const country = await this._repository.create(dto);
        return new StandardCountryDto(country);
    }
    async getByCode(isoCode: string) {
        return await this._details.getCountryByCode(this._repository, isoCode);
    }

    async getSupportedCountries() {
        const countries = await this._repository.getAll();
        return countries.map((country) => new StandardCountryDto(country));
    }

    async getSupportedCountryCodes() {
        const countries = await this.getSupportedCountries();
        return countries.map((country) => country.isoCode);
    }
}
