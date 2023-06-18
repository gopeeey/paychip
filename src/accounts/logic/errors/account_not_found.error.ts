import { NotFoundError } from "@bases/logic";

export class AccountNotFoundError<T> extends NotFoundError<undefined, T> {
    constructor(searchParams?: T) {
        super("Account not found", undefined, searchParams);
    }
}
