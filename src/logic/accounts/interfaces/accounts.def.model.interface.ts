import { BaseModelInterface } from "@logic/types";

export interface AccountModelInterfaceDef extends BaseModelInterface {
    id: string;
    name: string;
    email: string;
    password: string;
}
