import { Country } from "./country.model";
import { CountryModelInterface, CountryRepoInterface, CreateCountryDto } from "@logic/country";

export class CountryRepo implements CountryRepoInterface {
    constructor(private readonly _modelContext: typeof Country) {}

    create = async (createCountryDto: CreateCountryDto) => {
        const country = await this._modelContext.create(createCountryDto);
        return country.toJSON();
    };

    getByCode = async (code: CountryModelInterface["isoCode"]) => {
        const country = await this._modelContext.findByPk(code);
        return country ? country.toJSON() : country;
    };

    getAll = async () => {
        const countries = await this._modelContext.findAll();
        return countries.map((country) => country.toJSON());
    };
}
