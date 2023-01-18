import { UserProfileModelInterface } from "../../interfaces/db_logic";

export class CreateUserProfileDto
    implements Pick<UserProfileModelInterface, "name" | "email" | "password">
{
    name: string;
    email: string;
    password: string;
    constructor({
        name,
        email,
        password,
    }: Pick<UserProfileModelInterface, "name" | "email" | "password">) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
}
