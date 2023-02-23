import { BaseError } from "./base_error";

export class InternalError<L> extends BaseError<undefined, L> {
    constructor(message?: string, logData?: L) {
        super(message, logData);
    }
}
