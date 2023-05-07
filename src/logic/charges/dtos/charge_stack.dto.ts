import { ChargeStackModelInterface } from "../interfaces";

export class ChargeStackDto implements ChargeStackModelInterface {
    id: ChargeStackModelInterface["id"];
    businessId: ChargeStackModelInterface["businessId"];
    name: ChargeStackModelInterface["name"];
    description: ChargeStackModelInterface["description"];
    charges: ChargeStackModelInterface["charges"];
    paidBy: ChargeStackModelInterface["paidBy"];
    createdAt?: ChargeStackModelInterface["createdAt"];

    constructor(body: ChargeStackModelInterface) {
        this.id = body.id;
        this.businessId = body.businessId;
        this.name = body.name;
        this.description = body.description;
        this.charges = body.charges;
        this.paidBy = body.paidBy;
        this.createdAt = body.createdAt;
    }
}
