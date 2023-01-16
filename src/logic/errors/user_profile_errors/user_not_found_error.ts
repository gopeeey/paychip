import { NotFoundError } from "../base_errors";

export class UserNotFoundError extends NotFoundError {
    constructor(message: string = "User not found") {
        super(message);
    }
}
