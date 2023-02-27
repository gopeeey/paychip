import { WalletModelInterface } from "../interfaces";
import { StandardDtoType } from "@logic/types";

export class StandardWalletDto implements StandardDtoType<WalletModelInterface> {
    readonly id: string;
    readonly businessId: WalletModelInterface["businessId"];
    readonly parentWalletId: WalletModelInterface["parentWalletId"];
    readonly currency: WalletModelInterface["currency"];
    readonly balance: WalletModelInterface["balance"];
    readonly email: WalletModelInterface["email"];
    readonly walletType: WalletModelInterface["walletType"];
    readonly waiveFundingCharges: WalletModelInterface["waiveFundingCharges"];
    readonly waiveWithdrawalCharges: WalletModelInterface["waiveWithdrawalCharges"];
    readonly waiveWalletInCharges: WalletModelInterface["waiveWalletInCharges"];
    readonly waiveWalletOutCharges: WalletModelInterface["waiveWalletOutCharges"];
    readonly fundingChargeSchemeId: WalletModelInterface["fundingChargeSchemeId"];
    readonly withdrawalChargeSchemeId: WalletModelInterface["withdrawalChargeSchemeId"];
    readonly walletInChargeSchemeId: WalletModelInterface["walletInChargeSchemeId"];
    readonly walletOutChargeSchemeId: WalletModelInterface["walletOutChargeSchemeId"];

    constructor(body: WalletModelInterface) {
        this.id = body.id;
        this.businessId = body.businessId;
        this.parentWalletId = body.parentWalletId;
        this.currency = body.currency;
        this.balance = body.balance;
        this.email = body.email;
        this.walletType = body.walletType;
        this.waiveFundingCharges = body.waiveFundingCharges;
        this.waiveWithdrawalCharges = body.waiveWithdrawalCharges;
        this.waiveWalletInCharges = body.waiveWalletInCharges;
        this.waiveWalletOutCharges = body.waiveWalletOutCharges;
        this.fundingChargeSchemeId = body.fundingChargeSchemeId;
        this.withdrawalChargeSchemeId = body.withdrawalChargeSchemeId;
        this.walletInChargeSchemeId = body.walletInChargeSchemeId;
        this.walletOutChargeSchemeId = body.walletOutChargeSchemeId;
    }
}
