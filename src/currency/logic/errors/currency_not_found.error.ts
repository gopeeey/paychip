import { NotFoundError } from "@bases/logic";

export class CurrencyNotFoundError extends NotFoundError<undefined, undefined> {
    constructor() {
        super("Currency not found");
        this.name = "Currency Not Found Error";
    }
}
