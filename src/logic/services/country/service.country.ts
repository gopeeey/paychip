import { CreateCountryDto, StandardCountryDto } from "../../../contracts/dtos";
import {
    CountryServiceInterface,
    CountryServiceDependenciesInterface,
    CountryModelInterface,
} from "../../../contracts/interfaces";
import { CountryNotFoundError } from "../../errors";

export class CountryService implements CountryServiceInterface {
    private readonly _repository: CountryServiceDependenciesInterface["repo"];
    constructor(private readonly _dependencies: CountryServiceDependenciesInterface) {
        this._repository = this._dependencies.repo;
    }

    create = async (dto: CreateCountryDto) => {
        const country = await this._repository.create(dto);
        return new StandardCountryDto(country);
    };

    getByCode = async (isoCode: CountryModelInterface["isoCode"]) => {
        const country = await this._repository.getByCode(isoCode);
        if (!country) throw new CountryNotFoundError();
        return new StandardCountryDto(country);
    };

    getSupportedCountries = async () => {
        const countries = await this._repository.getAll();
        return countries.map((country) => new StandardCountryDto(country));
    };

    getSupportedCountryCodes = async () => {
        const countries = await this.getSupportedCountries();
        return countries.map((country) => country.isoCode);
    };
}
