import { AccountModelInterface } from "../../interfaces";

type requiredProps = Pick<AccountModelInterface, "name" | "email" | "password">;

export class CreateAccountDto implements requiredProps {
    readonly name: AccountModelInterface["name"];
    readonly email: AccountModelInterface["email"];
    readonly password: AccountModelInterface["password"];

    constructor(body: requiredProps) {
        // I should do some sort of validation in here, but nah
        // I'll just leave it up to joi in the web layer
        this.name = body.name;
        this.email = body.email;
        this.password = body.password;
    }
}
