import { BaseModelInterface } from "./base.model.interface";
import { BusinessModelInterface } from "./business.model.interface";

export interface CustomerModelInterface extends BaseModelInterface {
    id: string;
    businessId: BusinessModelInterface["id"];
    name: string;
    email: string;
    phone?: string;
}
