import { AccountModelInterface, AccountRepoInterface } from "@accounts/logic";
import { PgSession, runQuery } from "@db/postgres";
import * as queries from "./queries";
import { generateId } from "src/utils";
import { Pool } from "pg";
import { PgBaseRepo } from "@db/postgres";

export class AccountRepo extends PgBaseRepo implements AccountRepoInterface {
    constructor(private readonly _pool: Pool) {
        super(_pool);
    }

    create: AccountRepoInterface["create"] = async (createAccountDto, session) => {
        const id = generateId();
        const createQuery = queries.createAccountQuery({ ...createAccountDto, id });
        await runQuery<AccountModelInterface>(
            createQuery,
            this._pool,
            (session as PgSession)?.client
        );
        const account = await this.findById(id, session);
        if (!account) throw new Error("Error creating account");
        return account;
    };

    findByEmail: AccountRepoInterface["findByEmail"] = async (email, session) => {
        const query = queries.findByEmailQuery(email);
        const res = await runQuery<AccountModelInterface>(
            query,
            this._pool,
            (session as PgSession)?.client
        );
        const account = res.rows[0] || null;
        return account;
    };

    findById: AccountRepoInterface["findById"] = async (id, session) => {
        const query = queries.findByIdQuery(id);
        const res = await runQuery<AccountModelInterface>(
            query,
            this._pool,
            (session as PgSession)?.client
        );
        const account = res.rows[0] || null;
        return account;
    };
}
