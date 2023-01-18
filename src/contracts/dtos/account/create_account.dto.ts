import { AccountModelInterface } from "../../interfaces/db_logic";

export class CreateAccountDto
    implements Pick<AccountModelInterface, "name" | "email" | "password">
{
    name: string;
    email: string;
    password: string;
    constructor({
        name,
        email,
        password,
    }: Pick<AccountModelInterface, "name" | "email" | "password">) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
}
