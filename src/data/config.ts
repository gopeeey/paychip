import config from "../app_config";

const postgresConfig = config.db.postgres;

module.exports = {
    development: {
        database: postgresConfig.name,
        username: postgresConfig.username,
        password: postgresConfig.password,
        host: postgresConfig.host,
        dialect: "postgres",
    },
    test: {
        database: postgresConfig.name,
        username: postgresConfig.username,
        password: postgresConfig.password,
        host: postgresConfig.host,
        dialect: "postgres",
    },
    production: {
        database: postgresConfig.name,
        username: postgresConfig.username,
        password: postgresConfig.password,
        host: postgresConfig.host,
        dialect: "postgres",
    },
};
