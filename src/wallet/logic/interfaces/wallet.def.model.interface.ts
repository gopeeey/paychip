import { BaseModelInterface } from "@bases/logic";
import { BusinessModelInterfaceDef } from "@business/logic";
import { ChargeInterface, PaidByType } from "@charges/logic";
import { CurrencyModelInterfaceDef } from "@currency/logic";

export const allowedWalletTypes = ["personal", "commercial"] as const;

export interface WalletModelInterfaceDef extends BaseModelInterface {
    id: string;
    businessId: BusinessModelInterfaceDef["id"];
    businessWalletId?: string | null;
    currency: CurrencyModelInterfaceDef["isoCode"];
    isBusinessWallet: boolean;
    active: boolean;
    balance: number;
    email: string;
    customFundingCs: ChargeInterface[] | null;
    customWithdrawalCs: ChargeInterface[] | null;
    customWalletInCs: ChargeInterface[] | null;
    customWalletOutCs: ChargeInterface[] | null;
    waiveFundingCharges: boolean;
    waiveWithdrawalCharges: boolean;
    waiveWalletInCharges: boolean;
    waiveWalletOutCharges: boolean;
    w_fundingCs: ChargeInterface[] | null;
    w_withdrawalCs: ChargeInterface[] | null;
    w_walletInCs: ChargeInterface[] | null;
    w_walletOutCs: ChargeInterface[] | null;
    w_fundingChargesPaidBy: PaidByType | null;
    w_withdrawalChargesPaidBy: PaidByType | null;
}
