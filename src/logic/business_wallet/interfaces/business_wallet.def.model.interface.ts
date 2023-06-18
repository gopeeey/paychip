import { BusinessModelInterfaceDef } from "@logic/business";
import { PaidByType, ChargeInterface } from "@logic/charges";
import { CurrencyModelInterfaceDef } from "@logic/currency";
import { BaseModelInterface } from "@logic/types";

export interface BusinessWalletModelInterfaceDef extends BaseModelInterface {
    id: string;
    businessId: BusinessModelInterfaceDef["id"];
    currencyCode: CurrencyModelInterfaceDef["isoCode"];
    balance: number;
    customFundingCs: ChargeInterface[] | null;
    customWithdrawalCs: ChargeInterface[] | null;
    customWalletInCs: ChargeInterface[] | null;
    customWalletOutCs: ChargeInterface[] | null;
    fundingChargesPaidBy: PaidByType;
    withdrawalChargesPaidBy: PaidByType;
    w_fundingCs: ChargeInterface[] | null;
    w_withdrawalCs: ChargeInterface[] | null;
    w_walletInCs: ChargeInterface[] | null;
    w_walletOutCs: ChargeInterface[] | null;
    w_fundingChargesPaidBy: PaidByType;
    w_withdrawalChargesPaidBy: PaidByType;
}
