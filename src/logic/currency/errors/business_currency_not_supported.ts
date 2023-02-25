import { CurrencyModelInterface } from "../interfaces";
import { ValidationError } from "@logic/base_errors";

export class BusinessCurrencyNotSupportedError extends ValidationError<undefined, undefined> {
    constructor(currencyCode: CurrencyModelInterface["isoCode"]) {
        super(
            `You currently do not support this currency: ${currencyCode}. Please check or change your supported currencies in your dashboard`
        );
    }
}
