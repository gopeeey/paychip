import { AccountModelInterfaceDef } from "@accounts/logic";
import { BusinessModelInterfaceDef } from "./business.def.model.interface";
import { CountryModelInterfaceDef } from "@logic/country";
import { CustomerModelInterfaceDef } from "@logic/customer";
import { CurrencyModelInterfaceDef } from "@logic/currency";

export interface BusinessModelInterface extends BusinessModelInterfaceDef {
    owner?: AccountModelInterfaceDef;
    country?: CountryModelInterfaceDef;
    customers?: CustomerModelInterfaceDef[];
    currencies?: CurrencyModelInterfaceDef[];
}
