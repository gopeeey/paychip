import { AccountModelInterfaceDef } from "@accounts/logic";
import { BusinessModelInterfaceDef } from "./business.def.model.interface";
import { CountryModelInterfaceDef } from "@country/logic";
import { CustomerModelInterfaceDef } from "@customer/logic";
import { CurrencyModelInterfaceDef } from "@currency/logic";

export interface BusinessModelInterface extends BusinessModelInterfaceDef {
    owner?: AccountModelInterfaceDef;
    country?: CountryModelInterfaceDef;
    customers?: CustomerModelInterfaceDef[];
    currencies?: CurrencyModelInterfaceDef[];
}
