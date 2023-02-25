import { BaseModelInterface } from "@logic/types";
import { BusinessModelInterfaceDef } from "@logic/business";
import { ChargeSchemeModelInterfaceDef } from "@logic/charge_scheme";
import { CurrencyModelInterfaceDef } from "@logic/currency";

export const allowedWalletTypes = ["personal", "commercial"] as const;

export interface WalletModelInterfaceDef extends BaseModelInterface {
    id: string;
    businessId: BusinessModelInterfaceDef["id"];
    parentWalletId: string | null;
    currency: CurrencyModelInterfaceDef["isoCode"];
    balance: number;
    waiveFundingCharges: boolean;
    waiveWithdrawalCharges: boolean;
    email: string;
    chargeSchemeId: ChargeSchemeModelInterfaceDef["id"] | null;
    walletType: typeof allowedWalletTypes[number];
}
