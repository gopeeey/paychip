import { WalletModelInterface } from "../../interfaces";

type RequiredProps = Pick<
    WalletModelInterface,
    | "businessId"
    | "parentWalletId"
    | "currency"
    | "waiveFundingCharges"
    | "waiveWithdrawalCharges"
    | "email"
    | "chargeSchemeId"
    | "walletType"
>;

export class CreateWalletDto implements RequiredProps {
    businessId: WalletModelInterface["businessId"];
    parentWalletId: WalletModelInterface["parentWalletId"];
    currency: WalletModelInterface["currency"];
    waiveFundingCharges: WalletModelInterface["waiveFundingCharges"];
    waiveWithdrawalCharges: WalletModelInterface["waiveWithdrawalCharges"];
    email: WalletModelInterface["email"];
    chargeSchemeId: WalletModelInterface["chargeSchemeId"];
    walletType: WalletModelInterface["walletType"];

    constructor(body: RequiredProps) {
        this.businessId = body.businessId;
        this.parentWalletId = body.parentWalletId;
        this.currency = body.currency;
        this.waiveFundingCharges = body.waiveFundingCharges;
        this.waiveWithdrawalCharges = body.waiveWithdrawalCharges;
        this.email = body.email;
        this.chargeSchemeId = body.chargeSchemeId;
        this.walletType = body.walletType;
    }
}
