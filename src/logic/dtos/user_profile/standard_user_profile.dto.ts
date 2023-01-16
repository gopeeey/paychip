import { UserProfileAttributes } from "../../../db/models/user_profile.model";

export class StandardUserProfileDto
    implements Omit<UserProfileAttributes, "password" | "updatedAt" | "deletedAt">
{
    readonly name: UserProfileAttributes["name"];
    readonly email: UserProfileAttributes["email"];
    readonly createdAt: UserProfileAttributes["createdAt"];
    readonly id: UserProfileAttributes["id"];

    constructor(body: UserProfileAttributes) {
        this.name = body.name;
        this.email = body.email;
        this.createdAt = body.createdAt;
        this.id = body.id;
    }
}
