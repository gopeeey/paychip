import { PickWithOptional, ValidationError } from "@bases/logic";
import { WalletModelInterface } from "../interfaces";

type DuplicateWalletType = PickWithOptional<
    WalletModelInterface,
    "businessId" | "email" | "currency",
    "isBusinessWallet"
>;

export class DuplicateWalletError extends ValidationError<undefined, DuplicateWalletType> {
    constructor(data: DuplicateWalletType) {
        super("A wallet with this email address and currency already exists", undefined, data);
    }
}
