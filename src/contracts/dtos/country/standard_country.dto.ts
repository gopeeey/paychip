import { CountryModelInterface } from "../../interfaces/db_logic";

export class StandardCountryDto implements Omit<CountryModelInterface, "updatedAt" | "deletedAt"> {
    isoCode: string;
    name: string;
    createdAt: Date | undefined;

    constructor({ isoCode, name, createdAt }: CountryModelInterface) {
        this.isoCode = isoCode;
        this.name = name;
        this.createdAt = createdAt;
    }
}
