import { AccountModelInterface, AccountRepoInterface } from "@logic/accounts";
import { runQuery } from "@data/db";
import * as queries from "./queries";
import { generateId } from "src/utils";

export class AccountRepo implements AccountRepoInterface {
    create: AccountRepoInterface["create"] = async (createAccountDto, client) => {
        const id = generateId();
        const createQuery = queries.createAccountQuery({ ...createAccountDto, id });
        await runQuery<AccountModelInterface>(createQuery, client);
        const account = await this.findById(id, client);
        if (!account) throw new Error("Error creating account");
        return account;
    };

    findByEmail: AccountRepoInterface["findByEmail"] = async (email, client) => {
        const query = queries.findByEmailQuery(email);
        const res = await runQuery<AccountModelInterface>(query, client);
        return res.rows[0];
    };

    findById: AccountRepoInterface["findById"] = async (id, client) => {
        const query = queries.findByIdQuery(id);
        const res = await runQuery<AccountModelInterface>(query, client);
        return res.rows[0];
    };
}