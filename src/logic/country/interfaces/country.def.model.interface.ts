import { BaseModelInterface } from "@bases/logic";
import { CurrencyModelInterfaceDef } from "@logic/currency";

export interface CountryModelInterfaceDef extends BaseModelInterface {
    isoCode: string;
    name: string;
    currencyCode: CurrencyModelInterfaceDef["isoCode"];
    active: boolean;
}
