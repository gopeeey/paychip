import { BaseError } from "./base_error";

export class UnauthorizedError extends BaseError<undefined, undefined> {
    constructor(message?: string) {
        super(message || "Unauthorized");
    }
}
