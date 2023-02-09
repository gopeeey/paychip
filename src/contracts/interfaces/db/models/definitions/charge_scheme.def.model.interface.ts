import { BaseModelInterface } from "../base.model.interface";
import { BusinessModelInterfaceDef } from "./business.def.model.interface";
import { CurrencyModelInterfaceDef } from "./currency.def.model.interface";

export interface ChargeSchemeModelInterfaceDef extends BaseModelInterface {
    id: string;
    businessId: BusinessModelInterfaceDef["id"];
    name: string;
    description: string | null;
    currency: CurrencyModelInterfaceDef["isoCode"];
    transactionType: "credit" | "debit";
    primary: boolean;
    flatCharge: number;
    percentageCharge: number;
    percentageChargeCap: number;
    minimumPrincipalAmount: number;
}
