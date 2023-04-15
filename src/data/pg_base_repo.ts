import { BaseRepoInterface } from "@logic/base_repo_interface";
import { Pool } from "pg";
import { PgSession } from "./pg_session";

export class PgBaseRepo implements BaseRepoInterface {
    pool: Pool;
    constructor(pool: Pool) {
        this.pool = pool;
    }

    startSession: BaseRepoInterface["startSession"] = async () => {
        const client = await this.pool.connect();
        const session = await PgSession.start(client);
        return session;
    };
}
