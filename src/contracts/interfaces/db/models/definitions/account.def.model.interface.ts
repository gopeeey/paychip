import { BaseModelInterface } from "../base.model.interface";

export interface AccountModelInterfaceDef extends BaseModelInterface {
    id: string;
    name: string;
    email: string;
    password: string;
}
