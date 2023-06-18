import { NotFoundError } from "@logic/base_errors";

export class CurrencyNotFoundError extends NotFoundError<undefined, undefined> {
    constructor() {
        super("Currency not found");
        this.name = "Currency Not Found Error";
    }
}
