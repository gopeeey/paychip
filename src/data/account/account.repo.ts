import { Account } from "@data/account";
import { AccountModelInterface, AccountRepoInterface } from "@logic/account";

export class AccountRepo implements AccountRepoInterface {
    constructor(private readonly _modelContext: typeof Account) {}

    create = async (doc: Pick<Account, "email" | "password" | "name">) => {
        const { email, password, name } = doc;
        const account = await this._modelContext.create({ email, password, name });
        return account.toJSON();
    };

    findByEmail = async (email: string) => {
        const user_profile = await this._modelContext.findOne({ where: { email } });
        return user_profile ? user_profile.toJSON() : null;
    };

    findById = async (id: AccountModelInterface["id"]) => {
        const account = await this._modelContext.findByPk(id);
        return account ? account.toJSON() : null;
    };
}
