import { NotFoundError } from "../base_errors";

export class ChargeSchemeNotFoundError<T> extends NotFoundError<undefined, T> {
    constructor(searchParams?: T) {
        super("Charge scheme not found", undefined, searchParams);
    }
}
