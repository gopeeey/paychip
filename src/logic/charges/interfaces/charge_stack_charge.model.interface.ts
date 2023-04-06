import { BaseModelInterface } from "@logic/types";
import { ChargeModelInterface } from "./charge.model.interface";
import { ChargeStackModelInterface } from "./charge_stack.model.interface";

export interface ChargeStackChargeModelInterface extends BaseModelInterface {
    id: number;
    chargeStackId: ChargeStackModelInterface["id"];
    chargeId: ChargeModelInterface["id"];
}
