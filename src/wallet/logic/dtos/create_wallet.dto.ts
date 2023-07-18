import { PickWithOptional } from "@bases/logic";
import { WalletModelInterface } from "../interfaces";

type RequiredProps = PickWithOptional<
    WalletModelInterface,
    "businessId" | "currency" | "email",
    | "businessWalletId"
    | "isBusinessWallet"
    | "waiveFundingCharges"
    | "waiveWithdrawalCharges"
    | "waiveWalletInCharges"
    | "waiveWalletOutCharges"
>;

export class CreateWalletDto implements RequiredProps {
    businessId: RequiredProps["businessId"];
    isBusinessWallet: RequiredProps["isBusinessWallet"];
    businessWalletId: RequiredProps["businessWalletId"];
    currency: RequiredProps["currency"];
    email: RequiredProps["email"];
    waiveFundingCharges: RequiredProps["waiveFundingCharges"];
    waiveWithdrawalCharges: RequiredProps["waiveWithdrawalCharges"];
    waiveWalletInCharges: RequiredProps["waiveWalletInCharges"];
    waiveWalletOutCharges: RequiredProps["waiveWalletOutCharges"];

    constructor({
        waiveFundingCharges = false,
        waiveWithdrawalCharges = false,
        waiveWalletInCharges = false,
        waiveWalletOutCharges = false,
        isBusinessWallet = false,
        businessWalletId = null,
        ...body
    }: RequiredProps) {
        this.businessId = body.businessId;
        this.businessWalletId = businessWalletId;
        this.currency = body.currency;
        this.email = body.email;
        this.isBusinessWallet = isBusinessWallet;
        this.waiveFundingCharges = waiveFundingCharges;
        this.waiveWithdrawalCharges = waiveWithdrawalCharges;
        this.waiveWalletInCharges = waiveWalletInCharges;
        this.waiveWalletOutCharges = waiveWalletOutCharges;
    }
}
