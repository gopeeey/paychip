import { WalletModelInterface } from "../interfaces";

type RequiredProps = Pick<WalletModelInterface, "email" | "businessId" | "currency">;

export class GetUniqueWalletDto implements RequiredProps {
    businessId: WalletModelInterface["businessId"];
    email: WalletModelInterface["email"];
    currency: WalletModelInterface["currency"];

    constructor(body: RequiredProps) {
        this.businessId = body.businessId;
        this.email = body.email;
        this.currency = body.currency;
    }
}
