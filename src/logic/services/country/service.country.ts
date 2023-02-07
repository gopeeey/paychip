import { CreateCountryDto, StandardCountryDto } from "../../../contracts/dtos";
import {
    CountryServiceInterface,
    CountryServiceDependenciesInterface,
    CountryModelInterface,
} from "../../../contracts/interfaces";

export class CountryService implements CountryServiceInterface {
    private readonly _repository: CountryServiceDependenciesInterface["repo"];
    constructor(private readonly _dependencies: CountryServiceDependenciesInterface) {
        this._repository = this._dependencies.repo;
    }

    async create(dto: CreateCountryDto) {
        const country = await this._repository.create(dto);
        return new StandardCountryDto(country);
    }

    async getByCode(isoCode: CountryModelInterface["isoCode"]) {
        const country = await this._repository.getByCode(isoCode);
        if (!country) return null;
        return new StandardCountryDto(country);
    }

    async getSupportedCountries() {
        const countries = await this._repository.getAll();
        return countries.map((country) => new StandardCountryDto(country));
    }

    async getSupportedCountryCodes() {
        const countries = await this.getSupportedCountries();
        return countries.map((country) => country.isoCode);
    }

    async checkCountryIsSupported(isoCode: CountryModelInterface["isoCode"]) {
        const country = await this.getByCode(isoCode);
        return Boolean(country);
    }
}
