import { BaseModelInterface } from "../base.model.interface";
import { CurrencyModelInterfaceDef } from "./currency.def.model.interface";

export interface CountryModelInterfaceDef extends BaseModelInterface {
    isoCode: string;
    name: string;
    currencyCode: CurrencyModelInterfaceDef["isoCode"];
}
