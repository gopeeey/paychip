import { BaseModelInterface } from "../base.model.interface";
import { BusinessModelInterfaceDef } from "./business.def.model.interface";

export interface CustomerModelInterfaceDef extends BaseModelInterface {
    id: string;
    businessId: BusinessModelInterfaceDef["id"];
    name: string;
    email: string;
    phone?: string;
}
