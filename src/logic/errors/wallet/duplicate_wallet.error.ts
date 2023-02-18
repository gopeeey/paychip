import { ValidationError } from "../base_errors";
import { WalletModelInterface } from "../../../contracts/interfaces";

type DuplicateWalletType = Pick<WalletModelInterface, "businessId" | "email" | "currency">;

export class DuplicateWalletError extends ValidationError<undefined, DuplicateWalletType> {
    constructor(data: DuplicateWalletType) {
        super("duplicate wallet found", undefined, data);
    }
}
