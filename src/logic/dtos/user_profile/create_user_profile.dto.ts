import { UserProfileCreationAttributes } from "../../../db/models/user_profile.model";

export class CreateUserProfileDto
    implements Pick<UserProfileCreationAttributes, "name" | "email" | "password">
{
    name: string;
    email: string;
    password: string;
    constructor({
        name,
        email,
        password,
    }: Pick<UserProfileCreationAttributes, "name" | "email" | "password">) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
}
