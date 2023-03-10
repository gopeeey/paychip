import { CreateCountryDto } from "../dtos";
import { CountryModelInterface } from "./country.model.interface";

export interface CountryRepoInterface {
    create: (doc: CreateCountryDto) => Promise<CountryModelInterface>;

    getByCode: (code: string) => Promise<CountryModelInterface | null>;

    getAll: () => Promise<CountryModelInterface[]>;
}
