import { AccountModelInterfaceDef } from "./accounts.def.model.interface";
import { BusinessModelInterfaceDef } from "@business/logic";

export interface AccountModelInterface extends AccountModelInterfaceDef {
    businesses?: BusinessModelInterfaceDef[];
}
