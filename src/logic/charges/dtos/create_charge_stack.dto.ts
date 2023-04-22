import { PickWithOptional } from "@logic/types";
import { ChargeStackModelInterface } from "../interfaces";

type RequiredProps = PickWithOptional<
    ChargeStackModelInterface,
    "businessId" | "name" | "description" | "charges",
    "paidBy"
>;

export class CreateChargeStackDto implements RequiredProps {
    businessId: ChargeStackModelInterface["businessId"];
    name: ChargeStackModelInterface["name"];
    description: ChargeStackModelInterface["description"];
    paidBy: Exclude<RequiredProps["paidBy"], undefined> = null;
    charges: RequiredProps["charges"];

    constructor(body: RequiredProps) {
        this.businessId = body.businessId;
        this.name = body.name;
        this.description = body.description;
        this.paidBy = body.paidBy || null;
        this.charges = body.charges;
    }
}
