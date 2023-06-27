import { InternalError } from "@bases/logic";

export class PaymentResolutionError<L> extends InternalError<L> {
    constructor(message: string, data?: L) {
        super("Unable to resolve payment: " + message, data);
    }
}
