import { BusinessModelInterfaceDef } from "@business/logic";
import { PaidByType, ChargeInterface } from "@charges/logic";
import { CurrencyModelInterfaceDef } from "@currency/logic";
import { BaseModelInterface } from "@bases/logic";

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
