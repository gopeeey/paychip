import { ValidationError } from "../base_errors";

export class EmailAlreadyRegisteredError extends ValidationError {
    constructor() {
        super("Email already registered");
    }
}
