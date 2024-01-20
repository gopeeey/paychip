import { ValidationError } from "@bases/logic";

export class InvalidBankDetails extends ValidationError<undefined, undefined> {
    constructor() {
        super("Invalid bank account details");
    }
}
