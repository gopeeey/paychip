import { ChargeModelInterface } from "../interfaces";

type RequiredProps = Pick<
    ChargeModelInterface,
    | "businessId"
    | "flatCharge"
    | "minimumPrincipalAmount"
    | "name"
    | "percentageCharge"
    | "percentageChargeCap"
>;

export class CreateChargeDto implements RequiredProps {
    businessId: ChargeModelInterface["businessId"];
    flatCharge: ChargeModelInterface["flatCharge"];
    minimumPrincipalAmount: ChargeModelInterface["minimumPrincipalAmount"];
    name: ChargeModelInterface["name"];
    percentageCharge: ChargeModelInterface["percentageCharge"];
    percentageChargeCap: ChargeModelInterface["percentageChargeCap"];

    constructor(body: RequiredProps) {
        this.businessId = body.businessId;
        this.flatCharge = body.flatCharge;
        this.minimumPrincipalAmount = body.minimumPrincipalAmount;
        this.name = body.name;
        this.percentageCharge = body.percentageCharge;
        this.percentageChargeCap = body.percentageChargeCap;
    }
}
