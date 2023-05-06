import { CountryModelInterface } from "../interfaces";
import { StandardDtoType } from "@logic/types";

export class StandardCountryDto implements StandardDtoType<CountryModelInterface> {
    readonly isoCode: string;
    readonly name: string;
    readonly createdAt: CountryModelInterface["createdAt"];
    readonly currencyCode: CountryModelInterface["currencyCode"];

    constructor(body: CountryModelInterface) {
        this.isoCode = body.isoCode;
        this.name = body.name;
        this.createdAt = body.createdAt;
        this.currencyCode = body.currencyCode;
    }
}
