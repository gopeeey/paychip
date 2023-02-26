import { BaseModelInterface } from "@logic/types";
import { AccountModelInterfaceDef } from "@logic/account";
import { CountryModelInterfaceDef } from "@logic/country";

export interface BusinessModelInterfaceDef extends BaseModelInterface {
    id: number;
    ownerId: AccountModelInterfaceDef["id"];
    name: string;
    countryCode: CountryModelInterfaceDef["isoCode"];
}
