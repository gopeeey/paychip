import UserProfile from "../models/user_profile.model";
import { UserProfileRepoInterface } from "../../contracts/interfaces/db_logic";

class UserProfileRepo implements UserProfileRepoInterface {
    constructor(private readonly _modelContext: typeof UserProfile) {}

    async create(doc: Pick<UserProfile, "email" | "password" | "name">) {
        const { email, password, name } = doc;
        const user_profile = await this._modelContext.create({ email, password, name });
        return user_profile.toJSON();
    }

    async findByEmail(email: string) {
        const user_profile = await this._modelContext.findOne({ where: { email } });
        return user_profile ? user_profile.toJSON() : null;
    }
}

export default UserProfileRepo;
