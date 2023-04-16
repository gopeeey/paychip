import { BaseModelInterface } from "@logic/types";
import { BusinessModelInterfaceDef } from "@logic/business";
import { ChargeStackModelInterfaceDef } from "@logic/charges";
import { CurrencyModelInterfaceDef } from "@logic/currency";
import { BusinessWalletModelInterfaceDef } from "@logic/business_wallet";

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
    fundingChargesPaidBy: ChargeStackModelInterfaceDef["paidBy"] | null;
    withdrawalChargesPaidBy: ChargeStackModelInterfaceDef["paidBy"] | null;
}
