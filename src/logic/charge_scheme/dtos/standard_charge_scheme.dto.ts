import { ChargeSchemeModelInterface } from "../interfaces";
import { StandardDtoType } from "@logic/types";

export class StandardChargeSchemeDto implements StandardDtoType<ChargeSchemeModelInterface> {
    readonly id: ChargeSchemeModelInterface["id"];
    readonly name: ChargeSchemeModelInterface["name"];
    readonly description: ChargeSchemeModelInterface["description"];
    readonly businessId: ChargeSchemeModelInterface["businessId"];
    readonly currency: ChargeSchemeModelInterface["currency"];
    readonly transactionType: ChargeSchemeModelInterface["transactionType"];
    readonly primary: ChargeSchemeModelInterface["primary"];
    readonly flatCharge: ChargeSchemeModelInterface["flatCharge"];
    readonly percentageCharge: ChargeSchemeModelInterface["percentageCharge"];
    readonly percentageChargeCap: ChargeSchemeModelInterface["percentageChargeCap"];
    readonly minimumPrincipalAmount: ChargeSchemeModelInterface["minimumPrincipalAmount"];
    readonly payer: ChargeSchemeModelInterface["payer"];

    constructor(body: ChargeSchemeModelInterface) {
        this.id = body.id;
        this.name = body.name;
        this.description = body.description;
        this.businessId = body.businessId;
        this.currency = body.currency;
        this.transactionType = body.transactionType;
        this.primary = body.primary;
        this.flatCharge = body.flatCharge;
        this.percentageCharge = body.percentageCharge;
        this.percentageChargeCap = body.percentageChargeCap;
        this.minimumPrincipalAmount = body.minimumPrincipalAmount;
        this.payer = body.payer;
    }
}
