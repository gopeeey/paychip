import { PaymentProviderType } from "@logic/transaction";
import dotenv from "dotenv";
import path from "path";

const NODE_ENV = process.env.NODE_ENV as "production" | "development" | "test";
dotenv.config({ path: path.join(__dirname, `../.env.${NODE_ENV}`) });

// server
const SERVER_PORT = process.env.SERVER_PORT as string;
const HOST_URL = process.env.HOST_URL as string;

// postgres
const POSTGRES_DB_NAME = process.env.POSTGRES_DB_NAME as string;
const POSTGRES_DB_USERNAME = process.env.POSTGRES_DB_USERNAME as string;
const POSTGRES_DB_PASSWORD = process.env.POSTGRES_DB_PASSWORD as string;
const POSTGRES_DB_HOST = process.env.POSTGRES_DB_HOST as string;
const POSTGRES_DB_PORT = process.env.POSTGRES_DB_PORT as string;
// const MIGRATIONS_DATABASE_URL = process.env.MIGRATIONS_DATABASE_URL as string;

const POSTGRES_TEST_DB_NAME = process.env.POSTGRES_TEST_DB_NAME as string;
const POSTGRES_TEST_DB_USERNAME = process.env.POSTGRES_TEST_DB_USERNAME as string;
const POSTGRES_TEST_DB_PASSWORD = process.env.POSTGRES_TEST_DB_PASSWORD as string;
const POSTGRES_TEST_DB_HOST = process.env.POSTGRES_TEST_DB_HOST as string;
const POSTGRES_TEST_DB_PORT = process.env.POSTGRES_TEST_DB_PORT as string;

// payment settings
const CURRENT_PAYMENT_PROVIDER = process.env.CURRENT_PAYMENT_PROVIDER as PaymentProviderType;
const CURRENT_TRANSFER_PROVIDER = process.env.CURRENT_TRANSFER_PROVIDER as PaymentProviderType;

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
        port: Number(POSTGRES_DB_PORT),
    },
    postgresTest: {
        name: POSTGRES_TEST_DB_NAME,
        username: POSTGRES_TEST_DB_USERNAME,
        password: POSTGRES_TEST_DB_PASSWORD,
        host: POSTGRES_TEST_DB_HOST,
        port: Number(POSTGRES_TEST_DB_PORT),
    },
};

const paymentSettings = {
    currentPaymentProvider: CURRENT_PAYMENT_PROVIDER,
    currentTransferProvider: CURRENT_TRANSFER_PROVIDER,
};

const misc = {
    jwtSecret: JWT_SECRET,
};

const config = {
    server: serverConfig,
    db: dbConfig,
    payment: paymentSettings,
    misc,
};

export default config;
