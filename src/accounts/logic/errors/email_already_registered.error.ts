import { ValidationError } from "@bases/logic";

export class EmailAlreadyRegisteredError extends ValidationError<null, string> {
    constructor(email?: string) {
        super("Email already registered", undefined, email);
    }
}
