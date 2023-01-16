import { UserProfileAttributes } from "../../../db/models/user_profile.model";

export class LoginDto implements Pick<UserProfileAttributes, "email" | "password"> {
    email: string;
    password: string;
    constructor({ email, password }: Pick<UserProfileAttributes, "email" | "password">) {
        this.email = email;
        this.password = password;
    }
}
