import { CountryModelInterface } from "../interfaces";

type requiredProps = Pick<CountryModelInterface, "isoCode" | "name" | "currencyCode">;

export class CreateCountryDto implements requiredProps {
    isoCode: string;
    name: string;
    currencyCode: CountryModelInterface["currencyCode"];
    active: CountryModelInterface["active"];

    constructor(body: requiredProps) {
        this.isoCode = body.isoCode;
        this.name = body.name;
        this.currencyCode = body.currencyCode;
        this.active = true;
    }
}
