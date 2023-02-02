import { BaseModelInterface } from "../base.model.interface";

export interface CountryModelInterfaceDef extends BaseModelInterface {
    isoCode: string;
    name: string;
}
