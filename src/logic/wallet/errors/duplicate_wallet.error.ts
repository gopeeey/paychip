import { ValidationError } from "@bases/logic";
import { WalletModelInterface } from "../interfaces";

type DuplicateWalletType = Pick<WalletModelInterface, "businessId" | "email" | "currency">;

export class DuplicateWalletError extends ValidationError<undefined, DuplicateWalletType> {
    constructor(data: DuplicateWalletType) {
        super("A wallet with this email address and currency already exists", undefined, data);
    }
}
