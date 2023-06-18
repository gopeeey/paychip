import { ValidationError } from "@bases/logic";

export class InvalidFundingData extends ValidationError<undefined, undefined> {
    constructor() {
        super(
            "Invalid wallet funding data. Please provide the walletId, or the email and currency of the wallet"
        );
    }
}
