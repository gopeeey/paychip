import { AccountModelInterface, AccountRepoInterface } from "@accounts/logic";
import { runQuery } from "@data/db";
import * as queries from "./queries";
import { generateId } from "src/utils";
import { Pool } from "pg";
import { PgBaseRepo } from "@data/pg_base_repo";

export class AccountRepo extends PgBaseRepo implements AccountRepoInterface {
    constructor(private readonly _pool: Pool) {
        super(_pool);
    }

    create: AccountRepoInterface["create"] = async (createAccountDto, client) => {
        const id = generateId();
        const createQuery = queries.createAccountQuery({ ...createAccountDto, id });
        await runQuery<AccountModelInterface>(createQuery, this._pool, client);
        const account = await this.findById(id, client);
        if (!account) throw new Error("Error creating account");
        return account;
    };

    findByEmail: AccountRepoInterface["findByEmail"] = async (email, client) => {
        const query = queries.findByEmailQuery(email);
        const res = await runQuery<AccountModelInterface>(query, this._pool, client);
        const account = res.rows[0] || null;
        return account;
    };

    findById: AccountRepoInterface["findById"] = async (id, client) => {
        const query = queries.findByIdQuery(id);
        const res = await runQuery<AccountModelInterface>(query, this._pool, client);
        const account = res.rows[0] || null;
        return account;
    };
}
