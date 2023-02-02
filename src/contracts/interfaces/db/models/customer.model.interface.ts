import { BusinessModelInterfaceDef, CustomerModelInterfaceDef } from "./definitions";

export interface CustomerModelInterface extends CustomerModelInterfaceDef {
    business?: BusinessModelInterfaceDef;
}
