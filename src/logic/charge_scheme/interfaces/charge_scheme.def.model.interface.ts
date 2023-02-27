import { BaseModelInterface } from "@logic/types";
import { BusinessModelInterfaceDef } from "@logic/business";
import { CurrencyModelInterfaceDef } from "@logic/currency";

export const allowedChargeSchemePayers = ["wallet", "customer"] as const;
export const allowedChargeSchemeTransactions = [
    "funding",
    "withdrawal",
    "walletIn",
    "walletOut",
] as const;

export interface ChargeSchemeModelInterfaceDef extends BaseModelInterface {
    id: string;
    businessId: BusinessModelInterfaceDef["id"];
    name: string;
    description: string | null;
    currency: CurrencyModelInterfaceDef["isoCode"];
    transactionType: typeof allowedChargeSchemeTransactions[number];
    primary: boolean;
    flatCharge: number;
    percentageCharge: number;
    percentageChargeCap: number;
    minimumPrincipalAmount: number;
    payer: typeof allowedChargeSchemePayers[number];
}
