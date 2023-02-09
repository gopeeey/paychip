import {
    BusinessModelInterfaceDef,
    CountryModelInterfaceDef,
    CurrencyModelInterfaceDef,
} from "./definitions";

export interface CountryModelInterface extends CountryModelInterfaceDef {
    businesses?: BusinessModelInterfaceDef[];
    currency?: CurrencyModelInterfaceDef;
}
