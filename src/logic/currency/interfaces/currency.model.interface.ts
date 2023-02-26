import { CurrencyModelInterfaceDef } from "./currency.def.model.interface";
import { BusinessModelInterfaceDef } from "@logic/business";
import { CountryModelInterfaceDef } from "@logic/country";

export interface CurrencyModelInterface extends CurrencyModelInterfaceDef {
    businesses?: BusinessModelInterfaceDef[];
    countries?: CountryModelInterfaceDef[];
}
