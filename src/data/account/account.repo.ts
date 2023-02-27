import { Account } from "@data/account";
import { AccountModelInterface, AccountRepoInterface } from "@logic/account";
import { Transaction } from "sequelize";

export class AccountRepo implements AccountRepoInterface {
    constructor(private readonly _modelContext: typeof Account) {}

    create: AccountRepoInterface["create"] = async (createAccountDto, session) => {
        const account = await this._modelContext.create(createAccountDto, {
            transaction: session as Transaction,
        });
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
