import { BaseModelInterface } from "./base.model.interface";

export interface CustomerModelInterface extends BaseModelInterface {
    id: string;
    businessId: string;
    name: string;
    email: string;
    phone?: string;
}
