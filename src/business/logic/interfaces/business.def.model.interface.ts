import { BaseModelInterface } from "@bases/logic";
import { AccountModelInterfaceDef } from "@accounts/logic";
import { CountryModelInterfaceDef } from "@logic/country";

export interface BusinessModelInterfaceDef extends BaseModelInterface {
    id: number;
    ownerId: AccountModelInterfaceDef["id"];
    name: string;
    countryCode: CountryModelInterfaceDef["isoCode"];
}
