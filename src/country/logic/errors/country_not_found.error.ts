import { NotFoundError } from "@bases/logic";

export class CountryNotFoundError<T> extends NotFoundError<undefined, T> {
    constructor(searchParams?: T) {
        super("Country not found", undefined, searchParams);
    }
}
