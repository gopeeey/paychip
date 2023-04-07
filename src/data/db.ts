import { Pool, QueryResult, QueryResultRow, PoolClient } from "pg";
import { SQLStatement } from "sql-template-strings";
import config from "../config";

const postgresConfig = config.db.postgres;

export const pool = new Pool({
    database: postgresConfig.name,
    user: postgresConfig.username,
    password: postgresConfig.password,
    host: postgresConfig.host,
    // dialect: "postgres",
    // logging: false,
});

export const getClient = async () => {
    const client = await pool.connect();
    return client;
};

export type QueryRunner = <R extends QueryResultRow>(
    query: SQLStatement,
    client?: PoolClient
) => Promise<QueryResult<R>>;

export const runQuery: QueryRunner = async (query, client) => {
    const runner = client || pool;
    const result = await runner.query(query);
    return result;
};
