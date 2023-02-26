import { BaseModelInterface } from "@logic/types";

export interface CurrencyModelInterfaceDef extends BaseModelInterface {
    isoCode: string;
    name: string;
}
