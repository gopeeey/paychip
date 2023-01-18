import { AccountModelInterface } from "../../interfaces/db_logic";

export class StandardAccountDto
    implements Omit<AccountModelInterface, "password" | "updatedAt" | "deletedAt">
{
    readonly name: AccountModelInterface["name"];
    readonly email: AccountModelInterface["email"];
    readonly createdAt: AccountModelInterface["createdAt"];
    readonly id: AccountModelInterface["id"];

    constructor(body: AccountModelInterface) {
        this.name = body.name;
        this.email = body.email;
        this.createdAt = body.createdAt;
        this.id = body.id;
    }
}
