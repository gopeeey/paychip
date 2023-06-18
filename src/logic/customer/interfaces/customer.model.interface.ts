import { BusinessModelInterfaceDef } from "@business/logic";
import { CustomerModelInterfaceDef } from "./customer.def.model.interface";

export interface CustomerModelInterface extends CustomerModelInterfaceDef {
    business?: BusinessModelInterfaceDef;
}
