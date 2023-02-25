import { ChargeSchemeModelInterface } from "../interfaces";

type RequiredProps = Pick<
    ChargeSchemeModelInterface,
    | "name"
    | "businessId"
    | "currency"
    | "description"
    | "transactionType"
    | "payer"
    | "flatCharge"
    | "percentageCharge"
    | "percentageChargeCap"
    | "minimumPrincipalAmount"
>;

export class CreateChargeSchemeDto implements RequiredProps {
    name: ChargeSchemeModelInterface["name"];
    businessId: ChargeSchemeModelInterface["businessId"];
    currency: ChargeSchemeModelInterface["currency"];
    description: ChargeSchemeModelInterface["description"] = null;
    transactionType: ChargeSchemeModelInterface["transactionType"];
    payer: ChargeSchemeModelInterface["payer"];
    flatCharge: ChargeSchemeModelInterface["flatCharge"];
    percentageCharge: ChargeSchemeModelInterface["percentageCharge"];
    percentageChargeCap: ChargeSchemeModelInterface["percentageChargeCap"];
    minimumPrincipalAmount: ChargeSchemeModelInterface["minimumPrincipalAmount"];

    constructor(body: RequiredProps) {
        this.name = body.name;
        this.businessId = body.businessId;
        this.currency = body.currency;
        this.description = body.description;
        this.transactionType = body.transactionType;
        this.payer = body.payer;
        this.flatCharge = body.flatCharge;
        this.percentageCharge = body.percentageCharge;
        this.percentageChargeCap = body.percentageChargeCap;
        this.minimumPrincipalAmount = body.minimumPrincipalAmount;
    }
}
