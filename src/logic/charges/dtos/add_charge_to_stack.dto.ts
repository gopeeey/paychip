import { ChargeModelInterface, ChargeStackModelInterface } from "../interfaces";

type RequiredProps = {
    chargeIds: ChargeModelInterface["id"][];
    stackId: ChargeStackModelInterface["id"];
};

export class AddChargesToStackDto implements RequiredProps {
    chargeIds: ChargeModelInterface["id"][];
    stackId: ChargeStackModelInterface["id"];

    constructor(body: RequiredProps) {
        this.chargeIds = body.chargeIds;
        this.stackId = body.stackId;
    }
}
