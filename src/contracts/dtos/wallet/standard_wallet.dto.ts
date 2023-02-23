import { WalletModelInterface } from "../../interfaces";
import { StandardDtoType } from "../types";

export class StandardWalletDto implements StandardDtoType<WalletModelInterface> {
    readonly id: string;
    readonly businessId: WalletModelInterface["businessId"];
    readonly parentWalletId: WalletModelInterface["parentWalletId"];
    readonly currency: WalletModelInterface["currency"];
    readonly balance: WalletModelInterface["balance"];
    readonly waiveFundingCharges: WalletModelInterface["waiveFundingCharges"];
    readonly waiveWithdrawalCharges: WalletModelInterface["waiveWithdrawalCharges"];
    readonly email: WalletModelInterface["email"];
    readonly chargeSchemeId: WalletModelInterface["chargeSchemeId"];
    readonly walletType: WalletModelInterface["walletType"];

    constructor(body: WalletModelInterface) {
        this.id = body.id;
        this.businessId = body.businessId;
        this.parentWalletId = body.parentWalletId;
        this.currency = body.currency;
        this.balance = body.balance;
        this.waiveFundingCharges = body.waiveFundingCharges;
        this.waiveWithdrawalCharges = body.waiveWithdrawalCharges;
        this.email = body.email;
        this.chargeSchemeId = body.chargeSchemeId;
        this.walletType = body.walletType;
    }
}
