import { ChargeModelInterface } from "../interfaces";

type RequiredProps = Pick<
    ChargeModelInterface,
    "flatCharge" | "minimumPrincipalAmount" | "percentageCharge" | "percentageChargeCap"
>;

export class ChargeDto implements RequiredProps {
    flatCharge: ChargeModelInterface["flatCharge"];
    minimumPrincipalAmount: ChargeModelInterface["minimumPrincipalAmount"];
    percentageCharge: ChargeModelInterface["percentageCharge"];
    percentageChargeCap: ChargeModelInterface["percentageChargeCap"];

    constructor(body: RequiredProps) {
        this.flatCharge = body.flatCharge;
        this.minimumPrincipalAmount = body.minimumPrincipalAmount;
        this.percentageCharge = body.percentageCharge;
        this.percentageChargeCap = body.percentageChargeCap;
    }
}
