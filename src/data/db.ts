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

export const pool = new Pool(envConfig[config.server.nodeEnv]);

export const getClient = async (customPool?: Pool) => {
    const dPool = customPool || pool;
    const client = await dPool.connect();
    return client;
};

export type QueryRunner = <R extends QueryResultRow>(
    query: SQLStatement,
    client?: PoolClient | Pool
) => Promise<QueryResult<R>>;

export const runQuery: QueryRunner = async (query, client) => {
    const runner = client || pool;
    const result = await runner.query(query);
    return result;
};
