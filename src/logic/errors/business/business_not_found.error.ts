import { NotFoundError } from "../base_errors";

export class BusinessNotFoundError extends NotFoundError {
    constructor() {
        super("Business not found");
    }
}
