import { BusinessModelInterfaceDef } from "@logic/business";
import { CountryModelInterfaceDef } from "./country.def.model.interface";
import { CurrencyModelInterfaceDef } from "@logic/currency";

export interface CountryModelInterface extends CountryModelInterfaceDef {
    businesses?: BusinessModelInterfaceDef[];
    currency?: CurrencyModelInterfaceDef;
}
