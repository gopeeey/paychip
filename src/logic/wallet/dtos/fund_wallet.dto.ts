import { WalletModelInterface } from "../interfaces";

interface RequiredProps {
    businessId: WalletModelInterface["businessId"];
    walletId?: WalletModelInterface["id"];
    email?: WalletModelInterface["email"];
    currency?: WalletModelInterface["currency"];
    amount: number;
    callbackUrl: string;
}

export class FundWalletDto {
    businessId: WalletModelInterface["businessId"];
    walletId?: WalletModelInterface["id"];
    email?: WalletModelInterface["email"];
    currency?: WalletModelInterface["currency"];
    amount: number;
    callbackUrl: string;

    constructor(body: RequiredProps) {
        this.businessId = body.businessId;
        this.walletId = body.walletId;
        this.email = body.email;
        this.currency = body.currency;
        this.amount = body.amount;
        this.callbackUrl = body.callbackUrl;
    }
}
