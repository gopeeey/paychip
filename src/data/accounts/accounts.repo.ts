import { AccountModelInterface, AccountRepoInterface } from "@logic/accounts";
import { Transaction } from "sequelize";
import { runQuery } from "@data/db";
import * as queries from "./queries";
import { generateId } from "src/utils";

export class AccountRepo implements AccountRepoInterface {
    create: AccountRepoInterface["create"] = async (createAccountDto, session) => {
        const id = generateId();
        const createQuery = queries.createAccount({ ...createAccountDto, id });
        await runQuery<AccountModelInterface>(createQuery);
        return await this.findById(id);
    };

    findByEmail = async (email: string) => {
        const query = queries.findByEmail(email);
        const res = await runQuery<AccountModelInterface>(query);
        return res.rows[0];
    };

    findById = async (id: AccountModelInterface["id"]) => {
        const query = queries.findById(id);
        const res = await runQuery<AccountModelInterface>(query);
        return res.rows[0];
    };
}
