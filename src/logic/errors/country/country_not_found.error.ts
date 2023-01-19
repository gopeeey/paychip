import { NotFoundError } from "../base_errors";

export class CountryNotFoundError extends NotFoundError {
    constructor() {
        super("Country not found");
    }
}
