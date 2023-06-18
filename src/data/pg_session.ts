import { SessionInterface } from "@logic/session_interface";
import { PoolClient } from "pg";

export class PgSession implements SessionInterface {
    client: PoolClient;
    ended = false;
    private constructor(client: PoolClient) {
        this.client = client;
    }

    static async start(client: PoolClient) {
        await client.query("BEGIN");
        const session = new PgSession(client);
        return session;
    }

    commit: SessionInterface["commit"] = async () => {
        await this.client.query("COMMIT");
        this.client.release();
        this.ended = true;
    };

    rollback: SessionInterface["rollback"] = async () => {
        await this.client.query("ROLLBACK");
        this.client.release();
        this.ended = true;
    };
}
