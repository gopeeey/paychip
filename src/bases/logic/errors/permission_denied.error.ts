import { BaseError } from "./base_error";

export class PermissionDeniedError<D, L> extends BaseError<D, L> {
    constructor(message: string = "Permission denied", data?: D, logData?: L) {
        super(message, logData, data);
    }
}
