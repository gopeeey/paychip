import { UserProfileModelInterface } from "../../interfaces/db_logic";

export class LoginDto implements Pick<UserProfileModelInterface, "email" | "password"> {
    email: string;
    password: string;
    constructor({ email, password }: Pick<UserProfileModelInterface, "email" | "password">) {
        this.email = email;
        this.password = password;
    }
}
