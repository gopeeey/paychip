import { BusinessModelInterfaceDef } from "@logic/business";
import { BaseModelInterface } from "@logic/types";

export interface ChargeModelInterfaceDef extends BaseModelInterface {
    id: string;
    businessId: BusinessModelInterfaceDef["id"];
    name: string;
    flatCharge: number;
    percentageCharge: number;
    percentageChargeCap: number;
    minimumPrincipalAmount: number;
}
