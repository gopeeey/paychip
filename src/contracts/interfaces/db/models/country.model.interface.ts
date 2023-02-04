import { BusinessModelInterfaceDef, CountryModelInterfaceDef } from "./definitions";

export interface CountryModelInterface extends CountryModelInterfaceDef {
    businesses?: BusinessModelInterfaceDef[];
}
