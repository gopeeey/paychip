import { BaseModelInterface } from "@bases/logic";
import { BusinessModelInterfaceDef } from "@business/logic";
import { ChargeStackModelInterfaceDef } from "@charges/logic";
import { CurrencyModelInterfaceDef } from "@currency/logic";
import { BusinessWalletModelInterfaceDef } from "@business_wallet/logic";

export const allowedWalletTypes = ["personal", "commercial"] as const;

export interface WalletModelInterfaceDef extends BaseModelInterface {
    id: string;
    businessId: BusinessModelInterfaceDef["id"];
    businessWalletId: BusinessWalletModelInterfaceDef["id"];
    currency: CurrencyModelInterfaceDef["isoCode"];
    active: boolean;
    balance: number;
    email: string;
    waiveFundingCharges: boolean;
    waiveWithdrawalCharges: boolean;
    waiveWalletInCharges: boolean;
    waiveWalletOutCharges: boolean;
    fundingChargesPaidBy: ChargeStackModelInterfaceDef["paidBy"] | null | undefined;
    withdrawalChargesPaidBy: ChargeStackModelInterfaceDef["paidBy"] | null | undefined;
}
