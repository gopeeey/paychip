import { AccountModelInterface } from "../../interfaces/db_logic";

export class LoginDto implements Pick<AccountModelInterface, "email" | "password"> {
    email: string;
    password: string;
    constructor({ email, password }: Pick<AccountModelInterface, "email" | "password">) {
        this.email = email;
        this.password = password;
    }
}
