-- Up Migration
CREATE TYPE PAIDBY AS ENUM ('wallet', 'customer');
CREATE TYPE CHARGETYPE AS ENUM ('funding', 'withdrawal', 'walletIn', 'walletOut');

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
    "active" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY("currencyCode") REFERENCES "currencies"("isoCode") ON DELETE RESTRICT
);

CREATE TABLE "businesses" (
    "id" SERIAL PRIMARY KEY UNIQUE NOT NULL,
    "ownerId" VARCHAR(60) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "countryCode" VARCHAR(3) NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY("ownerId") REFERENCES "accounts"("id") ON DELETE SET NULL,
    FOREIGN KEY("countryCode") REFERENCES "countries"("isoCode") ON DELETE RESTRICT
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
    "w_withdrawalChargesPaidBy" PAIDBY NOT NULL DEFAULT 'wallet',
    FOREIGN KEY("businessId") REFERENCES "businesses"("id") ON DELETE SET NULL,
    FOREIGN KEY("currencyCode") REFERENCES "currencies"("isoCode") ON DELETE RESTRICT
);

CREATE TABLE "wallets" (
    "id" VARCHAR(60) PRIMARY KEY NOT NULL,
    "businessId" INTEGER NOT NULL,
    "businessWalletId" VARCHAR(60) NOT NULL,
    "currency" VARCHAR(60) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT TRUE,
    "balance" BIGINT NOT NULL DEFAULT 0,
    "email" VARCHAR(100) NOT NULL,
    "waiveFundingCharges" BOOLEAN NOT NULL DEFAULT FALSE,
    "waiveWithdrawalCharges" BOOLEAN NOT NULL DEFAULT FALSE,
    "waiveWalletInCharges" BOOLEAN NOT NULL DEFAULT FALSE,
    "waiveWalletOutCharges" BOOLEAN NOT NULL DEFAULT FALSE,
    "fundingChargesPaidBy" PAIDBY DEFAULT NULL,
    "withdrawalChargesPaidBy" PAIDBY DEFAULT NULL,
    FOREIGN KEY("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE,
    FOREIGN KEY("businessWalletId") REFERENCES "businessWallets"("id") ON DELETE CASCADE,
    FOREIGN KEY("currency") REFERENCES "currencies"("isoCode") ON DELETE RESTRICT,
    UNIQUE("businessId", "currency", "email")
);

CREATE TABLE "chargeStacks" (
    "id" VARCHAR(60) PRIMARY KEY NOT NULL,
    "businessId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(140),
    "charges" VARCHAR NOT NULL,
    "paidBy" PAIDBY,
    FOREIGN KEY("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE
);

CREATE TABLE "walletChargeStacks" (
    "chargeStackId" VARCHAR(60) NOT NULL,
    "walletId" VARCHAR(60) NOT NULL,
    "chargeType" CHARGETYPE NOT NULL,
    UNIQUE("walletId", "chargeType")
);


-- Down Migration
DROP TABLE "walletChargeStacks";

DROP TABLE "chargeStacks";

DROP TABLE "wallets";

DROP TABLE "businessWallets";

DROP TABLE "businesses";

DROP TABLE "countries";

DROP TABLE "currencies";

DROP TABLE "accounts";

DROP TYPE IF EXISTS CHARGETYPE;

DROP TYPE IF EXISTS PAIDBY;




