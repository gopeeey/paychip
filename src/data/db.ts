import { Pool } from "pg";
import config from "../app_config";

const postgresConfig = config.db.postgres;

export const pool = new Pool({
    database: postgresConfig.name,
    user: postgresConfig.username,
    password: postgresConfig.password,
    host: postgresConfig.host,
    // dialect: "postgres",
    // logging: false,
});
