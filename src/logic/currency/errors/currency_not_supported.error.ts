import { ValidationError } from "@logic/base_errors";
import { CurrencyModelInterface } from "../interfaces";

export class CurrencyNotSupportedError extends ValidationError<
    undefined,
    CurrencyModelInterface["isoCode"]
> {
    constructor(currencyCode: CurrencyModelInterface["isoCode"]) {
        super(`${currencyCode} is currently not supported`, undefined, currencyCode);
    }
}
