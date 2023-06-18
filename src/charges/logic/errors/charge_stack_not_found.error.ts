import { NotFoundError } from "@bases/logic";

export class ChargeStackNotFoundError extends NotFoundError<undefined, undefined> {
    constructor() {
        super("Charge stack not found");
    }
}
