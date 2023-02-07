import {
    BusinessModelInterfaceDef,
    CountryModelInterfaceDef,
    CurrencyModelInterfaceDef,
} from "./definitions";

export interface CurrencyModelInterface extends CurrencyModelInterfaceDef {
    businesses?: BusinessModelInterfaceDef[];
    countries?: CountryModelInterfaceDef[];
}
