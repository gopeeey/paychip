import { Pool, QueryResult, QueryResultRow, PoolClient } from "pg";
import { SQLStatement } from "sql-template-strings";
import config from "../config";

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

export const connectToDb: () => Promise<Pool> = () => {
    return new Promise((resolve, reject) => {
        console.log("Connecting to database...");
        const pool = new Pool(envConfig[config.server.nodeEnv]);
        pool.query("SELECT 1+1;")
            .then((res) => {
                console.log("Database connected");
                resolve(pool);
            })
            .catch((err) => reject(err));
    });
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
