import Account from "../models/account.model";
import { AccountRepoInterface } from "../../contracts/interfaces/db_logic";

class AccountRepo implements AccountRepoInterface {
    constructor(private readonly _modelContext: typeof Account) {}

    async create(doc: Pick<Account, "email" | "password" | "name">) {
        const { email, password, name } = doc;
        const user_profile = await this._modelContext.create({ email, password, name });
        return user_profile.toJSON();
    }

    async findByEmail(email: string) {
        const user_profile = await this._modelContext.findOne({ where: { email } });
        return user_profile ? user_profile.toJSON() : null;
    }
}

export default AccountRepo;
