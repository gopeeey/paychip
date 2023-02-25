import { BaseModelInterface } from "../base.model.interface";
import { BusinessModelInterfaceDef } from "./business.def.model.interface";
import { CurrencyModelInterfaceDef } from "./currency.def.model.interface";

export const allowedChargeSchemePayers = ["wallet", "customer"] as const;
export const allowedTransactionTypes = ["credit", "debit"];

export interface ChargeSchemeModelInterfaceDef extends BaseModelInterface {
    id: string;
    businessId: BusinessModelInterfaceDef["id"];
    name: string;
    description: string | null;
    currency: CurrencyModelInterfaceDef["isoCode"];
    transactionType: typeof allowedTransactionTypes[number];
    primary: boolean;
    flatCharge: number;
    percentageCharge: number;
    percentageChargeCap: number;
    minimumPrincipalAmount: number;
    payer: typeof allowedChargeSchemePayers[number];
}
