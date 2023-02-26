import { BaseModelInterface } from "@logic/types";
import { CurrencyModelInterfaceDef } from "@logic/currency";

export interface CountryModelInterfaceDef extends BaseModelInterface {
    isoCode: string;
    name: string;
    currencyCode: CurrencyModelInterfaceDef["isoCode"];
}
