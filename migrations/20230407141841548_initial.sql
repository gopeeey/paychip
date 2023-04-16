-- Up Migration
CREATE TYPE PAIDBY AS ENUM ('wallet', 'customer');

CREATE TABLE "accounts" (
    "id" VARCHAR(60) PRIMARY KEY UNIQUE NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL UNIQUE,
    "password" VARCHAR(72) NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL 
);

CREATE TABLE "currencies" (
    "isoCode" VARCHAR(3) PRIMARY KEY NOT NULL UNIQUE,
    "name" VARCHAR(100) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT TRUE,
    "fundingCs" VARCHAR NOT NULL,
    "withdrawalCs" VARCHAR NOT NULL,
    "walletInCs" VARCHAR NOT NULL,
    "walletOutCs" VARCHAR NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "countries" (
    "isoCode" VARCHAR(3) PRIMARY KEY UNIQUE NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "currencyCode" VARCHAR(3) NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL 
);

CREATE TABLE "businesses" (
    "id" SERIAL PRIMARY KEY UNIQUE NOT NULL,
    "ownerId" VARCHAR(60) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "countryCode" VARCHAR(3) NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL 
);

CREATE TABLE "businessWallets" (
    "id" VARCHAR(60) PRIMARY KEY NOT NULL,
    "businessId" INTEGER NOT NULL,
    "currencyCode" VARCHAR(3) NOT NULL,
    "balance" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "customFundingCs" VARCHAR,
    "customWithdrawalCs" VARCHAR,
    "customWalletInCs" VARCHAR,
    "customWalletOutCs" VARCHAR,
    "fundingChargesPaidBy" PAIDBY NOT NULL DEFAULT 'wallet',
    "withdrawalChargesPaidBy" PAIDBY NOT NULL DEFAULT 'wallet',
    "w_fundingCs" VARCHAR,
    "w_withdrawalCs" VARCHAR,
    "w_walletInCs" VARCHAR,
    "w_walletOutCs" VARCHAR,
    "w_fundingChargesPaidBy" PAIDBY NOT NULL DEFAULT 'wallet',
    "w_withdrawalChargesPaidBy" PAIDBY NOT NULL DEFAULT 'wallet'
);



-- Down Migration
DROP TABLE "businessWallets";

DROP TABLE "businesses";

DROP TABLE "countries";

DROP TABLE "currencies";

DROP TABLE "accounts";

DROP TYPE IF EXISTS PAIDBY;


