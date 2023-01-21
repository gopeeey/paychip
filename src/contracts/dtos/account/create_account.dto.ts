import { AccountModelInterface } from "../../interfaces";

type requiredProps = Pick<AccountModelInterface, "name" | "email" | "password">;

export class CreateAccountDto implements requiredProps {
    readonly name: AccountModelInterface["name"];
    readonly email: AccountModelInterface["email"];
    readonly password: AccountModelInterface["password"];

    constructor(body: requiredProps) {
        this.name = body.name;
        this.email = body.email;
        this.password = body.password;
    }
}
