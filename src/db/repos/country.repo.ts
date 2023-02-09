import { Country } from "../models";
import { CountryModelInterface, CountryRepoInterface } from "../../contracts/interfaces";
import { CreateCountryDto } from "../../contracts/dtos";

export class CountryRepo implements CountryRepoInterface {
    constructor(private readonly _modelContext: typeof Country) {}

    create = async (createCountryDto: CreateCountryDto) => {
        const country = await this._modelContext.create(createCountryDto);
        return country.toJSON();
    };

    getByCode = async (code: CountryModelInterface["isoCode"]) => {
        const country = await this._modelContext.findByPk(code, { include: "currency" });
        return country ? country.toJSON() : country;
    };

    getAll = async () => {
        const countries = await this._modelContext.findAll({ include: "currency" });
        return countries.map((country) => country.toJSON());
    };
}
