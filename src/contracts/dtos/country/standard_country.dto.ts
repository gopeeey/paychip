import { CountryModelInterface, CurrencyModelInterface } from "../../interfaces";
import { StandardDtoType } from "../types";

export class StandardCountryDto implements StandardDtoType<CountryModelInterface> {
    readonly isoCode: string;
    readonly name: string;
    readonly createdAt: Date | undefined;
    readonly currencyCode: CurrencyModelInterface["isoCode"];

    constructor(body: CountryModelInterface) {
        this.isoCode = body.isoCode;
        this.name = body.name;
        this.createdAt = body.createdAt;
        this.currencyCode = body.currencyCode;
    }
}
