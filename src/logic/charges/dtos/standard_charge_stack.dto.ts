import { StandardDtoType } from "@logic/types";
import { ChargeStackModelInterface } from "../interfaces";

export class StandardChargeStackDto implements StandardDtoType<ChargeStackModelInterface> {
    charges: ChargeStackModelInterface["charges"];
    name: ChargeStackModelInterface["name"];
    description: ChargeStackModelInterface["description"];
    paidBy: ChargeStackModelInterface["paidBy"];

    constructor(body: ChargeStackModelInterface) {
        this.charges = body.charges;
        this.name = body.name;
        this.description = body.description;
        this.paidBy = body.paidBy;
    }
}
