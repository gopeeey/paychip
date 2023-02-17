import { NotFoundError } from "../base_errors";

export class BusinessNotFoundError<T> extends NotFoundError<undefined, T> {
    constructor(searchParams?: T) {
        super("Business not found", undefined, searchParams);
    }
}
