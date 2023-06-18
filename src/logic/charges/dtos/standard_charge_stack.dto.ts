import { StandardDtoType } from "@bases/logic";
import { ChargeStackModelInterface } from "../interfaces";

export class StandardChargeStackDto implements StandardDtoType<ChargeStackModelInterface> {
    id: ChargeStackModelInterface["id"];
    charges: ChargeStackModelInterface["charges"];
    name: ChargeStackModelInterface["name"];
    description: ChargeStackModelInterface["description"];
    paidBy: ChargeStackModelInterface["paidBy"];

    constructor(body: ChargeStackModelInterface) {
        this.id = body.id;
        this.charges = body.charges;
        this.name = body.name;
        this.description = body.description;
        this.paidBy = body.paidBy;
    }
}
