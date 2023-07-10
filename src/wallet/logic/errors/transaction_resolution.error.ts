import { InternalError } from "@bases/logic";

export class TransactionResolutionError<L> extends InternalError<L> {
    critical = false;

    constructor(message: string, data?: L, critical = false) {
        super("Unable to resolve payment: " + message, data);
        this.critical = critical;
    }
}
