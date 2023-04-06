import { BusinessModelInterfaceDef } from "@logic/business";
import { PaidByType } from "@logic/charges";
import { CurrencyModelInterfaceDef } from "@logic/currency";
import { BaseModelInterface } from "@logic/types";

export interface BusinessWalletModelInterfaceDef extends BaseModelInterface {
    id: string;
    businessId: BusinessModelInterfaceDef["id"];
    currencyCode: CurrencyModelInterfaceDef["isoCode"];
    balance: number;
    customFundingCs: string;
    customWithdrawalCs: string;
    customWalletInCs: string;
    customWalletOutCs: string;
    fundingChargesPaidBy: PaidByType;
    withdrawalChargesPaidBy: PaidByType;
    w_fundingCs: string;
    w_withdrawalCs: string;
    w_walletInCs: string;
    w_walletOutCs: string;
    w_fundingChargesPaidBy: PaidByType;
    w_withdrawalChargesPaidBy: PaidByType;
}
