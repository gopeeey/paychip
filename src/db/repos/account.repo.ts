import { Account } from "../models";
import { AccountModelInterface, AccountRepoInterface } from "../../contracts/interfaces";

export class AccountRepo implements AccountRepoInterface {
    constructor(private readonly _modelContext: typeof Account) {}

    async create(doc: Pick<Account, "email" | "password" | "name">) {
        const { email, password, name } = doc;
        const account = await this._modelContext.create({ email, password, name });
        return account.toJSON();
    }

    async findByEmail(email: string) {
        const user_profile = await this._modelContext.findOne({ where: { email } });
        return user_profile ? user_profile.toJSON() : null;
    }

    async findById(id: AccountModelInterface["id"]) {
        const account = await this._modelContext.findByPk(id);
        return account ? account.toJSON() : null;
    }
}
