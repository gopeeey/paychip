import { CurrencyModelInterfaceDef } from "./currency.def.model.interface";
import { CountryModelInterfaceDef } from "@country/logic";

export interface CurrencyModelInterface extends CurrencyModelInterfaceDef {
    countries?: CountryModelInterfaceDef[];
}
