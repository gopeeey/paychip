import { Pool } from "pg";
import config from "src/config";

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
