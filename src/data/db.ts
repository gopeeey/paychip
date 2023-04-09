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

export type QueryRunner = <R extends QueryResultRow>(
    query: SQLStatement,
    pool: Pool,
    client?: PoolClient
) => Promise<QueryResult<R>>;

export const runQuery: QueryRunner = async (query, pool, client) => {
    const runner = client || pool;
    const result = await runner.query(query);
    return result;
};
