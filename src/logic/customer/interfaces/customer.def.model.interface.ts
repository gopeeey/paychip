import { BaseModelInterface } from "@logic/types";
import { BusinessModelInterfaceDef } from "@logic/business";

export interface CustomerModelInterfaceDef extends BaseModelInterface {
    id: string;
    businessId: BusinessModelInterfaceDef["id"];
    name?: string;
    email: string;
    phone?: string;
}
