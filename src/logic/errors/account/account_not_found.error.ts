import { NotFoundError } from "../base_errors";

export class AccountNotFoundError extends NotFoundError {
    constructor(message: string = "Account not found") {
        super(message);
    }
}
