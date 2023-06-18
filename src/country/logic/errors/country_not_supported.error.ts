import { ValidationError } from "@bases/logic";

export class CountryNotSuportedError<T> extends ValidationError<undefined, T> {
    constructor(countryData?: T) {
        super("Country not supported", undefined, countryData);
    }
}
