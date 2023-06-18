import { CurrencyModelInterfaceDef } from "./currency.def.model.interface";
import { CountryModelInterfaceDef } from "@logic/country";

export interface CurrencyModelInterface extends CurrencyModelInterfaceDef {
    countries?: CountryModelInterfaceDef[];
}
