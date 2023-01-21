import { AccountModelInterface } from "../../interfaces";

type requiredProps = Pick<AccountModelInterface, "email" | "password">;

export class LoginDto implements requiredProps {
    readonly email: AccountModelInterface["email"];
    readonly password: AccountModelInterface["password"];

    constructor(body: requiredProps) {
        this.email = body.email;
        this.password = body.password;
    }
}
