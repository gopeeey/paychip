import { Pool, QueryResult, QueryResultRow } from "pg";
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

export const runQuery: <R extends QueryResultRow>(
    query: SQLStatement
) => Promise<QueryResult<R>> = (query) => {
    return new Promise((resolve, reject) => {
        pool.query(query)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    });
};
