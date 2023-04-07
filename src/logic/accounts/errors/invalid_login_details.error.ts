import { ValidationError } from "@logic/base_errors";

export class InvalidLoginDetailsError extends ValidationError<undefined, undefined> {
    constructor() {
        super("Invalid email or password");
    }
}
