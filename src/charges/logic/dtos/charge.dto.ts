import { ChargeInterface } from "../interfaces";

type RequiredProps = Pick<
    ChargeInterface,
    "flatCharge" | "minimumPrincipalAmount" | "percentageCharge" | "percentageChargeCap"
>;

export class ChargeDto implements RequiredProps {
    flatCharge: ChargeInterface["flatCharge"];
    minimumPrincipalAmount: ChargeInterface["minimumPrincipalAmount"];
    percentageCharge: ChargeInterface["percentageCharge"];
    percentageChargeCap: ChargeInterface["percentageChargeCap"];

    constructor(body: RequiredProps) {
        this.flatCharge = body.flatCharge;
        this.minimumPrincipalAmount = body.minimumPrincipalAmount;
        this.percentageCharge = body.percentageCharge;
        this.percentageChargeCap = body.percentageChargeCap;
    }
}
