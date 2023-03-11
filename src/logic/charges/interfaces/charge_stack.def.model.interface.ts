import { BusinessModelInterfaceDef } from "@logic/business";
import { BaseModelInterface } from "@logic/types";

export interface ChargeStackModelInterfaceDef extends BaseModelInterface {
    id: string;
    businessId: BusinessModelInterfaceDef["id"];
    name: string;
    description: string | null;
}
