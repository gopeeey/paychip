import { WalletModelInterface } from "../interfaces";

type RequiredProps = Pick<
    WalletModelInterface,
    | "businessId"
    | "parentWalletId"
    | "currency"
    | "email"
    | "walletType"
    | "waiveFundingCharges"
    | "waiveWithdrawalCharges"
    | "waiveWalletInCharges"
    | "waiveWalletOutCharges"
    | "fundingChargeStackId"
    | "withdrawalChargeStackId"
    | "walletInChargeStackId"
    | "walletOutChargeStackId"
>;

export class CreateWalletDto implements RequiredProps {
    businessId: WalletModelInterface["businessId"];
    parentWalletId: WalletModelInterface["parentWalletId"];
    currency: WalletModelInterface["currency"];
    email: WalletModelInterface["email"];
    walletType: WalletModelInterface["walletType"];
    waiveFundingCharges: WalletModelInterface["waiveFundingCharges"];
    waiveWithdrawalCharges: WalletModelInterface["waiveWithdrawalCharges"];
    waiveWalletInCharges: WalletModelInterface["waiveWalletInCharges"];
    waiveWalletOutCharges: WalletModelInterface["waiveWalletOutCharges"];
    fundingChargeStackId: WalletModelInterface["fundingChargeStackId"];
    withdrawalChargeStackId: WalletModelInterface["withdrawalChargeStackId"];
    walletInChargeStackId: WalletModelInterface["walletInChargeStackId"];
    walletOutChargeStackId: WalletModelInterface["walletOutChargeStackId"];

    constructor(body: RequiredProps) {
        this.businessId = body.businessId;
        this.parentWalletId = body.parentWalletId;
        this.currency = body.currency;
        this.email = body.email;
        this.walletType = body.walletType;
        this.waiveFundingCharges = body.waiveFundingCharges;
        this.waiveWithdrawalCharges = body.waiveWithdrawalCharges;
        this.waiveWalletInCharges = body.waiveWalletInCharges;
        this.waiveWalletOutCharges = body.waiveWalletOutCharges;
        this.fundingChargeStackId = body.fundingChargeStackId;
        this.withdrawalChargeStackId = body.withdrawalChargeStackId;
        this.walletInChargeStackId = body.walletInChargeStackId;
        this.walletOutChargeStackId = body.walletOutChargeStackId;
    }
}
