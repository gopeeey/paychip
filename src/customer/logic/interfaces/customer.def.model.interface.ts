import { BaseModelInterface } from "@bases/logic";
import { BusinessModelInterfaceDef } from "@business/logic";

export interface CustomerModelInterfaceDef extends BaseModelInterface {
    id: string;
    businessId: BusinessModelInterfaceDef["id"];
    name?: string;
    email: string;
    phone?: string;
}
