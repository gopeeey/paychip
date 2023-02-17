import { NotFoundError } from "../base_errors";

export class CountryNotFoundError<T> extends NotFoundError<undefined, T> {
    constructor(searchParams?: T) {
        super("Country not found", undefined, searchParams);
    }
}
