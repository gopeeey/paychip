import { StandardDtoType } from "@logic/types";
import { ChargeModelInterface } from "../interfaces";

export class StandardChargeDto implements StandardDtoType<ChargeModelInterface> {
    id: ChargeModelInterface["id"];
    businessId: ChargeModelInterface["businessId"];
    name: ChargeModelInterface["name"];
    flatCharge: ChargeModelInterface["flatCharge"];
    percentageCharge: ChargeModelInterface["percentageCharge"];
    percentageChargeCap: ChargeModelInterface["percentageChargeCap"];
    minimumPrincipalAmount: ChargeModelInterface["minimumPrincipalAmount"];

    constructor(body: ChargeModelInterface) {
        this.id = body.id;
        this.businessId = body.businessId;
        this.name = body.name;
        this.flatCharge = body.flatCharge;
        this.percentageCharge = body.percentageCharge;
        this.percentageChargeCap = body.percentageChargeCap;
        this.minimumPrincipalAmount = body.minimumPrincipalAmount;
    }
}
