import { AccountModelInterfaceDef, BusinessModelInterfaceDef } from "./definitions";

export interface AccountModelInterface extends AccountModelInterfaceDef {
    businesses?: BusinessModelInterfaceDef[];
}
