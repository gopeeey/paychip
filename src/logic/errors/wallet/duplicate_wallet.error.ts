import { ValidationError } from "../base_errors";
import { WalletModelInterface } from "../../../contracts/interfaces";

type DuplicateType = Pick<WalletModelInterface, "businessId" | "email" | "currency">;

export class DuplicateWalletError extends ValidationError<undefined, DuplicateType> {
    constructor(data: DuplicateType) {
        super("duplicate wallet found", undefined, data);
    }
}
