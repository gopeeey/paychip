import { CountryModelInterface, CurrencyModelInterface } from "../../interfaces";

type requiredProps = Pick<CountryModelInterface, "isoCode" | "name" | "currencyCode">;

export class CreateCountryDto implements requiredProps {
    readonly isoCode: string;
    readonly name: string;
    readonly currencyCode: CurrencyModelInterface["isoCode"];

    constructor(body: requiredProps) {
        this.isoCode = body.isoCode;
        this.name = body.name;
        this.currencyCode = body.currencyCode;
    }
}
