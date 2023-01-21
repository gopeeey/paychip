import { BaseModelInterface } from "./base.model.interface";

export interface CountryModelInterface extends BaseModelInterface {
    isoCode: string;
    name: string;
}
