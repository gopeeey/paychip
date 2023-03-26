import { Sequelize } from "sequelize";
import config from "../config";

const postgresConfig = config.db.postgres;

export const db = new Sequelize({
    database: postgresConfig.name,
    username: postgresConfig.username,
    password: postgresConfig.password,
    host: postgresConfig.host,
    dialect: "postgres",
    logging: true,
});
