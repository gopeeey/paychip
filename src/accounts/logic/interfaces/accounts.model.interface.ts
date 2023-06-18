import { AccountModelInterfaceDef } from "./accounts.def.model.interface";
import { BusinessModelInterfaceDef } from "@logic/business";

export interface AccountModelInterface extends AccountModelInterfaceDef {
    businesses?: BusinessModelInterfaceDef[];
}
