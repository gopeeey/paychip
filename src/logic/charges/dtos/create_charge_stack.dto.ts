import { ChargeStackModelInterface } from "../interfaces";

type RequiredProps = Pick<
    ChargeStackModelInterface,
    "businessId" | "name" | "description" | "paidBy"
>;

export class CreateChargeStackDto implements RequiredProps {
    businessId: ChargeStackModelInterface["businessId"];
    name: ChargeStackModelInterface["name"];
    description: ChargeStackModelInterface["description"];
    paidBy: ChargeStackModelInterface["paidBy"];

    constructor(body: RequiredProps) {
        this.businessId = body.businessId;
        this.name = body.name;
        this.description = body.description;
        this.paidBy = body.paidBy;
    }
}
