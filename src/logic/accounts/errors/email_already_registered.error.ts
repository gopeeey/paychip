import { ValidationError } from "@logic/base_errors";

export class EmailAlreadyRegisteredError extends ValidationError<null, string> {
    constructor(email?: string) {
        super("Email already registered", undefined, email);
    }
}
