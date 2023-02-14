import { NotFoundError } from "../base_errors";

export class ChargeSchemeNotFoundError extends NotFoundError {
    constructor() {
        super("Charge scheme not found");
    }
}
