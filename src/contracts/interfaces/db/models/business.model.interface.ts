import {
    AccountModelInterfaceDef,
    BusinessModelInterfaceDef,
    CountryModelInterfaceDef,
    CustomerModelInterfaceDef,
} from "./definitions";

export interface BusinessModelInterface extends BusinessModelInterfaceDef {
    owner?: AccountModelInterfaceDef;
    country?: CountryModelInterfaceDef;
    customers?: CustomerModelInterfaceDef[];
}
