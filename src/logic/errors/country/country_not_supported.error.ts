import { ValidationError } from "../base_errors";

export class CountryNotSuportedError extends ValidationError {
    constructor() {
        super("Country not supported");
    }
}
