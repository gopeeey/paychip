import { BaseError } from "./base_error";

export class ValidationError<D, L> extends BaseError<D, L> {
    constructor(message: string, data?: D, logData?: L) {
        super(message, logData, data);
    }
}
