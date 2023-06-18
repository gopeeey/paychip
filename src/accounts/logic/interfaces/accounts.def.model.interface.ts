import { BaseModelInterface } from "@bases/logic";

export interface AccountModelInterfaceDef extends BaseModelInterface {
    id: string;
    name: string;
    email: string;
    password: string;
}
