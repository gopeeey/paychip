import { NotFoundError } from "@logic/base_errors";

export class ChargeStackNotFoundError extends NotFoundError<undefined, undefined> {
    constructor() {
        super("Charge stack not found");
    }
}
