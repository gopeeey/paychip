import { BaseModelInterface } from "@logic/types";
import { BusinessModelInterfaceDef } from "@logic/business";
import { ChargeStackModelInterfaceDef } from "@logic/charges";
import { CurrencyModelInterfaceDef } from "@logic/currency";

export const allowedWalletTypes = ["personal", "commercial"] as const;
export const allowedChargesPaidBy = ["wallet", "customer", null] as const;

export type WalletChargesPaidByType = typeof allowedChargesPaidBy[number];

export interface WalletModelInterfaceDef extends BaseModelInterface {
    id: string;
    businessId: BusinessModelInterfaceDef["id"];
    parentWalletId: string | null;
    currency: CurrencyModelInterfaceDef["isoCode"];
    balance: number;
    email: string;
    walletType: typeof allowedWalletTypes[number];
    waiveFundingCharges: boolean;
    waiveWithdrawalCharges: boolean;
    waiveWalletInCharges: boolean;
    waiveWalletOutCharges: boolean;
    // fundingChargesPaidBy: WalletChargesPaidByType;
    // withdrawalChargesPaidBy: WalletChargesPaidByType;
}
