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
const CURRENT_PAYMENT_PROVIDER = process.env.CURRENT_PAYMENT_PROVIDER as string;
const CURRENT_TRANSFER_PROVIDER = process.env.CURRENT_TRANSFER_PROVIDER as string;
const CURRENT_BANK_VERIFICATION_PROVIDER = process.env.CURRENT_BANK_VERIFICATION_PROVIDER as string;

// third party keys
// paystack
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY as string;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY as string;

// rabbitmq
const RABBITMQ_CONNECTION_URL = process.env.RABBITMQ_CONNECTION_URL as string;

// redis
const REDIS_URL = process.env.REDIS_URL as string;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD as string;
const REDIS_PORT = process.env.REDIS_PORT as string;

// misc
const JWT_SECRET = process.env.JWT_SECRET as string;
const DOMAIN_NAME = process.env.DOMAIN_NAME as string;

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
    providerErrorMessage: "Payment provider error",
    currentProviders: {
        transfer: CURRENT_TRANSFER_PROVIDER,
        payment: CURRENT_PAYMENT_PROVIDER,
        bankVerification: CURRENT_BANK_VERIFICATION_PROVIDER,
    },
};

const thirdParty = {
    paystack: {
        secretKey: PAYSTACK_SECRET_KEY,
        publicKey: PAYSTACK_PUBLIC_KEY,
    },
    rabbitMq: { connectionUrl: RABBITMQ_CONNECTION_URL },
    redis: { url: REDIS_URL, port: REDIS_PORT, password: REDIS_PASSWORD },
};

const misc = {
    jwtSecret: JWT_SECRET,
    domainName: DOMAIN_NAME,
    emailSuffix: `@${DOMAIN_NAME}`,
};

const config = {
    server: serverConfig,
    db: dbConfig,
    payment: paymentSettings,
    thirdParty,
    misc,
};

export default config;
