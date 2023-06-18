import { BusinessModelInterfaceDef } from "@business/logic";
import { CountryModelInterfaceDef } from "./country.def.model.interface";
import { CurrencyModelInterfaceDef } from "@logic/currency";

export interface CountryModelInterface extends CountryModelInterfaceDef {
    businesses?: BusinessModelInterfaceDef[];
    currency?: CurrencyModelInterfaceDef;
}
