import { CurrencyModelInterface } from "../../interfaces";

export class StandardCurrencyDto {
    name: CurrencyModelInterface["name"];
    isoCode: CurrencyModelInterface["isoCode"];

    constructor(body: CurrencyModelInterface) {
        this.name = body.name;
        this.isoCode = body.isoCode;
    }
}
