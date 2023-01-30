import { Country } from "../models";
import { CountryModelInterface, CountryRepoInterface } from "../../contracts/interfaces";
import { CreateCountryDto } from "../../contracts/dtos";

export class CountryRepo implements CountryRepoInterface {
    constructor(private readonly _modelContext: typeof Country) {}

    async create(createCountryDto: CreateCountryDto) {
        const { isoCode, name } = createCountryDto;
        const country = await this._modelContext.create({ isoCode, name });
        return country.toJSON();
    }

    async getByCode(code: string) {
        const country = await this._modelContext.findByPk(code);
        return country ? country.toJSON() : country;
    }

    async getAll() {
        const countries = await this._modelContext.findAll();
        return countries.map((country) => country.toJSON());
    }
}
