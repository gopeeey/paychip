import { PickWithOptional } from "@logic/types";
import { WalletModelInterface } from "../interfaces";

type RequiredProps = PickWithOptional<
    WalletModelInterface,
    | "businessId"
    | "businessWalletId"
    | "currency"
    | "email"
    | "waiveFundingCharges"
    | "waiveWithdrawalCharges"
    | "waiveWalletInCharges"
    | "waiveWalletOutCharges",
    "fundingChargesPaidBy" | "withdrawalChargesPaidBy"
>;

export class CreateWalletDto implements RequiredProps {
    businessId: RequiredProps["businessId"];
    businessWalletId: RequiredProps["businessWalletId"];
    currency: RequiredProps["currency"];
    email: RequiredProps["email"];
    waiveFundingCharges: RequiredProps["waiveFundingCharges"];
    waiveWithdrawalCharges: RequiredProps["waiveWithdrawalCharges"];
    waiveWalletInCharges: RequiredProps["waiveWalletInCharges"];
    waiveWalletOutCharges: RequiredProps["waiveWalletOutCharges"];
    fundingChargesPaidBy: RequiredProps["fundingChargesPaidBy"];
    withdrawalChargesPaidBy: RequiredProps["withdrawalChargesPaidBy"];

    constructor({
        fundingChargesPaidBy = null,
        withdrawalChargesPaidBy = null,
        ...body
    }: RequiredProps) {
        this.businessId = body.businessId;
        this.businessWalletId = body.businessWalletId;
        this.currency = body.currency;
        this.email = body.email;
        this.waiveFundingCharges = body.waiveFundingCharges;
        this.waiveWithdrawalCharges = body.waiveWithdrawalCharges;
        this.waiveWalletInCharges = body.waiveWalletInCharges;
        this.waiveWalletOutCharges = body.waiveWalletOutCharges;
        this.fundingChargesPaidBy = fundingChargesPaidBy;
        this.withdrawalChargesPaidBy = withdrawalChargesPaidBy;
    }
}
