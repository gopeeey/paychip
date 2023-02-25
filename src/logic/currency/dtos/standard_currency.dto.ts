import { CurrencyModelInterface } from "../interfaces";
import { StandardDtoType } from "@logic/types";

export class StandardCurrencyDto implements StandardDtoType<CurrencyModelInterface> {
    name: CurrencyModelInterface["name"];
    isoCode: CurrencyModelInterface["isoCode"];

    constructor(body: CurrencyModelInterface) {
        this.name = body.name;
        this.isoCode = body.isoCode;
    }
}
