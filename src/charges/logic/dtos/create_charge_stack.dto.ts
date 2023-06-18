import { PickWithOptional } from "@bases/logic";
import { ChargeStackModelInterface } from "../interfaces";

type RequiredProps = PickWithOptional<
    ChargeStackModelInterface,
    "businessId" | "name" | "description" | "charges" | "paidBy"
>;

export class CreateChargeStackDto implements RequiredProps {
    businessId: ChargeStackModelInterface["businessId"];
    name: ChargeStackModelInterface["name"];
    description: ChargeStackModelInterface["description"];
    paidBy: ChargeStackModelInterface["paidBy"];
    charges: RequiredProps["charges"];

    constructor(body: RequiredProps) {
        this.businessId = body.businessId;
        this.name = body.name;
        this.description = body.description;
        this.paidBy = body.paidBy;
        this.charges = body.charges;
    }
}
