import { BusinessModelInterfaceDef } from "@logic/business";
import { ChargeStackModelInterfaceDef } from "./charge_stack.def.model.interface";

export interface ChargeStackModelInterface extends ChargeStackModelInterfaceDef {
    charges?: [];
    business?: BusinessModelInterfaceDef;
}
