import { BaseModelInterface } from "../base.model.interface";
import { AccountModelInterfaceDef } from "./account.def.model.interface";
import { CountryModelInterfaceDef } from "./country.def.model.interface";

export interface BusinessModelInterfaceDef extends BaseModelInterface {
    id: number;
    ownerId: AccountModelInterfaceDef["id"];
    name: string;
    countryCode: CountryModelInterfaceDef["isoCode"];
}
