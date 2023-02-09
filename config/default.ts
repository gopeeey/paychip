import dotenv from "dotenv";

dotenv.config();

// server
const SERVER_PORT = process.env.SERVER_PORT as string;
const HOST_URL = process.env.HOST_URL as string;
const NODE_ENV = process.env.NODE_ENV as string;

// postgres
const POSTGRES_DB_NAME = process.env.POSTGRES_DB_NAME as string;
const POSTGRES_DB_USERNAME = process.env.POSTGRES_DB_USERNAME as string;
const POSTGRES_DB_PASSWORD = process.env.POSTGRES_DB_PASSWORD as string;
const POSTGRES_DB_HOST = process.env.POSTGRES_DB_HOST as string;

// misc
const JWT_SECRET = process.env.JWT_SECRET as string;

const serverConfig = {
    port: Number(SERVER_PORT),
    hostUrl: HOST_URL,
    nodeEnv: NODE_ENV,
};

const dbConfig = {
    postgres: {
        name: POSTGRES_DB_NAME,
        username: POSTGRES_DB_USERNAME,
        password: POSTGRES_DB_PASSWORD,
        host: POSTGRES_DB_HOST,
    },
};

const misc = {
    jwtSecret: JWT_SECRET,
};

const config = {
    server: serverConfig,
    db: dbConfig,
    misc,
};

export type ServerConfigType = typeof serverConfig;
export type DbConfigType = typeof dbConfig;
export type MiscConfigType = typeof misc;

export default config;
