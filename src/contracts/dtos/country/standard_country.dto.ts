import { CountryModelInterface } from "../../interfaces";
import { StandardDtoType } from "../types";

export class StandardCountryDto implements StandardDtoType<CountryModelInterface> {
    readonly isoCode: string;
    readonly name: string;
    readonly createdAt: Date | undefined;

    constructor(body: CountryModelInterface) {
        this.isoCode = body.isoCode;
        this.name = body.name;
        this.createdAt = body.createdAt;
    }
}
