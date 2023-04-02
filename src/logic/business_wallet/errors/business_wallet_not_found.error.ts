import { BusinessWalletModelInterface as BwModelInterface } from "../interfaces";
import { ValidationError } from "@logic/base_errors";

export class BusinessWalletNotFoundError extends ValidationError<undefined, undefined> {
    constructor(currencyCode: BwModelInterface["currencyCode"]) {
        super(`Business currently does not support ${currencyCode}`);
    }
}
