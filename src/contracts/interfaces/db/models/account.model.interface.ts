import { BaseModelInterface } from "./base.model.interface";

export interface AccountModelInterface extends BaseModelInterface {
    id: string;
    name: string;
    email: string;
    password: string;
}
