import { UserProfileModelInterface } from "../../interfaces/db_logic";

export class StandardUserProfileDto
    implements Omit<UserProfileModelInterface, "password" | "updatedAt" | "deletedAt">
{
    readonly name: UserProfileModelInterface["name"];
    readonly email: UserProfileModelInterface["email"];
    readonly createdAt: UserProfileModelInterface["createdAt"];
    readonly id: UserProfileModelInterface["id"];

    constructor(body: UserProfileModelInterface) {
        this.name = body.name;
        this.email = body.email;
        this.createdAt = body.createdAt;
        this.id = body.id;
    }
}
