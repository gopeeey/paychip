import { BusinessModelInterfaceDef, CurrencyModelInterfaceDef } from "./definitions";

export interface CurrencyModelInterface extends CurrencyModelInterfaceDef {
    businesses?: BusinessModelInterfaceDef[];
}
