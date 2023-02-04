import { CurrencyModelInterface } from "../../interfaces";

type ArgTypes = {
    name: CurrencyModelInterface["name"];
    isoCode: CurrencyModelInterface["isoCode"];
};

export class CreateCurrencyDto {
    name: ArgTypes["name"];
    isoCode: ArgTypes["isoCode"];

    constructor({ name, isoCode }: ArgTypes) {
        this.name = name;
        this.isoCode = isoCode;
    }
}
