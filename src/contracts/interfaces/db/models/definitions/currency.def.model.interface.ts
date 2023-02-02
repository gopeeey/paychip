import { BaseModelInterface } from "../base.model.interface";

export interface CurrencyModelInterfaceDef extends BaseModelInterface {
    isoCode: string;
    name: string;
}
