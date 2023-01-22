import { CreateCountryDto, StandardCountryDto } from "../../../contracts/dtos";
import {
    CountryServiceInterface,
    CountryServiceDependenciesInterface,
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

    async getByCode(isoCode: string) {
        return await this._dependencies.getCountryByCode(isoCode);
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
