import { ValidationError } from "../base_errors";

export class InvalidLoginDetailsError extends ValidationError {
    constructor() {
        super("Invalid email or password");
    }
}
