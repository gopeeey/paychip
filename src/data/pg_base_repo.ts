import { BaseRepoInterface } from "@base_interfaces/logic/base_repo_interface";
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
