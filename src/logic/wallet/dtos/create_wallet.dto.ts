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
    }
}
