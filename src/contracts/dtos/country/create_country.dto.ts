import { CountryModelInterface } from "../../interfaces/db_logic";

export class CreateCountryDto implements Pick<CountryModelInterface, "isoCode" | "name"> {
    isoCode: string;
    name: string;
    constructor({ isoCode, name }: Pick<CountryModelInterface, "isoCode" | "name">) {
        this.isoCode = isoCode;
        this.name = name;
    }
}
