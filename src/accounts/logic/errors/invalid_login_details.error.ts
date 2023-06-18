import { ValidationError } from "@bases/logic";

export class InvalidLoginDetailsError extends ValidationError<undefined, undefined> {
    constructor() {
        super("Invalid email or password");
    }
}
