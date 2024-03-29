import { BaseRepoInterface } from "@bases/logic";
import { Pool } from "pg";
import { PgSession } from "./pg_session";

export class PgBaseRepo implements BaseRepoInterface {
    constructor(private readonly pgPool: Pool) {}

    startSession: BaseRepoInterface["startSession"] = async () => {
        const client = await this.pgPool.connect();
        const session = await PgSession.start(client);
        return session;
    };
}
