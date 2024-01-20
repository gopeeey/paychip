import { NotFoundError } from "@bases/logic";

export class TransactionNotFoundError extends NotFoundError<undefined, undefined> {
    constructor() {
        super("Transaction not found");
        this.name = "TransactionNotFoundError";
    }
}
