import { ValidationError } from "@logic/base_errors";

export class CountryNotSuportedError<T> extends ValidationError<undefined, T> {
    constructor(countryData?: T) {
        super("Country not supported", undefined, countryData);
    }
}
