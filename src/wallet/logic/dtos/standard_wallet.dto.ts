import { WalletModelInterface } from "../interfaces";
import { StandardDtoType } from "@bases/logic";

export class StandardWalletDto implements StandardDtoType<WalletModelInterface> {
    readonly id: string;
    readonly businessId: WalletModelInterface["businessId"];
    readonly currency: WalletModelInterface["currency"];
    readonly balance: WalletModelInterface["balance"];
    readonly email: WalletModelInterface["email"];
    readonly waiveFundingCharges: WalletModelInterface["waiveFundingCharges"];
    readonly waiveWithdrawalCharges: WalletModelInterface["waiveWithdrawalCharges"];
    readonly waiveWalletInCharges: WalletModelInterface["waiveWalletInCharges"];
    readonly waiveWalletOutCharges: WalletModelInterface["waiveWalletOutCharges"];

    constructor(body: WalletModelInterface) {
        this.id = body.id;
        this.businessId = body.businessId;
        this.currency = body.currency;
        this.balance = body.balance;
        this.email = body.email;
        this.waiveFundingCharges = body.waiveFundingCharges;
        this.waiveWithdrawalCharges = body.waiveWithdrawalCharges;
        this.waiveWalletInCharges = body.waiveWalletInCharges;
        this.waiveWalletOutCharges = body.waiveWalletOutCharges;
    }
}
