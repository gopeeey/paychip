import { PickWithOptional } from "@bases/logic";
import { WalletModelInterface } from "../interfaces";

type RequiredProps = PickWithOptional<
    WalletModelInterface,
    "email" | "businessId" | "currency",
    "isBusinessWallet"
>;

export class GetUniqueWalletDto implements RequiredProps {
    businessId: WalletModelInterface["businessId"];
    email: WalletModelInterface["email"];
    currency: WalletModelInterface["currency"];
    isBusinessWallet?: WalletModelInterface["isBusinessWallet"];

    constructor({ isBusinessWallet = false, ...body }: RequiredProps) {
        this.businessId = body.businessId;
        this.email = body.email;
        this.currency = body.currency;
        this.isBusinessWallet = isBusinessWallet;
    }
}
