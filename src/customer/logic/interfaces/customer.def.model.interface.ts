import { BaseModelInterface } from "@bases/logic";
import { BusinessModelInterfaceDef } from "@business/logic";

export interface CustomerModelInterfaceDef extends BaseModelInterface {
    id: string;
    businessId: BusinessModelInterfaceDef["id"];
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    phone?: string | null;
}
