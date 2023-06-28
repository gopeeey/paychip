import { Pool, QueryResult, QueryResultRow, PoolClient, types } from "pg";
import { SQLStatement } from "sql-template-strings";
import config from "src/config";
import runnerFunc from "node-pg-migrate";
import path from "path";

types.setTypeParser(types.builtins.NUMERIC, (num) => parseFloat(num));
const postgresConfig = config.db.postgres;
const postgresTestConfig = config.db.postgresTest;

const envConfig = {
    test: {
        database: postgresTestConfig.name,
        user: postgresTestConfig.username,
        password: postgresTestConfig.password,
        host: postgresTestConfig.host,
    },
    development: {
        database: postgresConfig.name,
        user: postgresConfig.username,
        password: postgresConfig.password,
        host: postgresConfig.host,
    },
    production: {
        database: postgresConfig.name,
        user: postgresConfig.username,
        password: postgresConfig.password,
        host: postgresConfig.host,
    },
};

export const runMigrations = async (direction: "up" | "down", pool: Pool, count = 10000) => {
    // console.log("Running migrations", direction);

    const client = await pool.connect();
    await runnerFunc({
        dbClient: client,
        direction,
        count,
        dir: path.join(__dirname, "../../../migrations"),
        migrationsTable: "pgmigrations",
    });
    client.release();
};

export const oldConnectToDb: () => Promise<Pool> = () => {
    return new Promise((resolve, reject) => {
        console.log("Connecting to database...");
        const pool = new Pool(envConfig[config.server.nodeEnv]);
        pool.query("SELECT 1+1;")
            .then((res) => {
                runMigrations("up", pool, 100000);
                console.log("Database connected");
                resolve(pool);
            })
            .catch((err) => reject(err));
    });
};

export const connectToDb: () => Promise<Pool> = async () => {
    console.log("Connecting to database...");
    const pool = new Pool(envConfig[config.server.nodeEnv]);
    await pool.query("SELECT 1+1");
    await runMigrations("up", pool, 100000);
    console.log("Database connected");
    return pool;
};

export type QueryRunner = <R extends QueryResultRow>(
    query: SQLStatement | string,
    pool: Pool,
    client?: PoolClient
) => Promise<QueryResult<R>>;

export const runQuery: QueryRunner = async (query, pool, client) => {
    const runner = client || pool;
    const result = await runner.query(query);
    return result;
};
