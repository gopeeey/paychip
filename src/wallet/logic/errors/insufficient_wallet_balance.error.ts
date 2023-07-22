import { ValidationError } from "@bases/logic";

export class InsufficientWalletBalanceError extends ValidationError<undefined, undefined> {
    constructor() {
        super("Insufficient wallet balance");
    }
}
