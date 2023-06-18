import { NotFoundError } from "@bases/logic";

export class BusinessNotFoundError<T> extends NotFoundError<undefined, T> {
    constructor(searchParams?: T) {
        super("Business not found", undefined, searchParams);
    }
}
