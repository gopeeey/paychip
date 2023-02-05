import {
    AccountModelInterfaceDef,
    BusinessModelInterfaceDef,
    CountryModelInterfaceDef,
    CurrencyModelInterfaceDef,
    CustomerModelInterfaceDef,
} from "./definitions";

export interface BusinessModelInterface extends BusinessModelInterfaceDef {
    owner?: AccountModelInterfaceDef;
    country?: CountryModelInterfaceDef;
    customers?: CustomerModelInterfaceDef[];
    currencies?: CurrencyModelInterfaceDef[];
}
