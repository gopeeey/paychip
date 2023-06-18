import { BusinessModelInterfaceDef } from "@business/logic";
import { ChargeStackModelInterfaceDef } from "./charge_stack.def.model.interface";

export interface ChargeStackModelInterface extends ChargeStackModelInterfaceDef {
    business?: BusinessModelInterfaceDef;
}
