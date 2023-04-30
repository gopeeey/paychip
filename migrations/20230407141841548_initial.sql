-- Up Migration
CREATE TYPE PAIDBY AS ENUM ('wallet', 'customer');
CREATE TYPE CHARGETYPE AS ENUM ('funding', 'withdrawal', 'walletIn', 'walletOut');
CREATE TYPE TRANSACTIONTYPE AS ENUM ('credit', 'debit');
CREATE TYPE TRANSACTIONSTATUS AS ENUM ('pending', 'successful', 'failed');
CREATE TYPE TRANSACTIONCHANNEL AS ENUM('bank', 'card', 'wallet');


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
    "ownerId" VARCHAR(60),
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
    UNIQUE("walletId", "chargeType"),
    FOREIGN KEY("chargeStackId") REFERENCES "chargeStacks"("id") ON DELETE CASCADE,
    FOREIGN KEY("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE
);

CREATE TABLE "customers" (
    "id" VARCHAR(60) PRIMARY KEY NOT NULL,
    "businessId" INTEGER NOT NULL,
    "name" VARCHAR(100),
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    UNIQUE("businessId", "email"),
    FOREIGN KEY("businessId") REFERENCES "businesses"("id") ON DELETE SET NULL,

);

CREATE TABLE "transactions" (
    "id" VARCHAR(60) PRIMARY KEY NOT NULL,
    "businessId" VARCHAR(60) NOT NULL,
    "customerId" VARCHAR(60),
    "transactionsType" TRANSACTIONTYPE NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "bwId": VARCHAR(60) NOT NULL,
    "status" TRANSACTIONSTATUS NOT NULL DEFAULT 'pending',
    "channel" TRANSACTIONCHANNEL NOT NULL,
    "amount" BIGINT NOT NULL,
    "settledAmount" BIGINT NOT NULL,
    "senderPaid" BIGINT NOT NULL DEFAULT 0,
    "receiverPaid" BIGINT NOT NULL DEFAULT 0,
    "businessPaid" BIGINT NOT NULL DEFAULT 0,
    "businessCharge" BIGINT NOT NULL DEFAULT 0,
    "platformCharge" BIGINT NOT NULL DEFAULT 0,
    "businessGot" BIGINT NOT NULL DEFAULT 0,
    "platformGot" BIGINT NOT NULL DEFAULT 0,
    "businessChargePaidBy" BIGINT NOT NULL DEFAULT 0,
    "platformChargePaidBy" BIGINT NOT NULL DEFAULT 0,
    "senderWalletId" VARCHAR(60),
    "receiverWalletId" VARCHAR(60),
    "provider" VARCHAR(20),
    "providerRef" VARCHAR,
    "bankName" VARCHAR,
    "accountNumber" VARCHAR(20),
    "bankCode" VARCHAR(10),
    "accountName" VARCHAR(100),
    "cardNumber" VARCHAR(20),
    "cardType" VARCHAR(10),
    FOREIGN KEY("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE,
    FOREIGN KEY("customerId") REFERENCES "customers"("id") ON DELETE SET NULL,
    FOREIGN KEY("currency") REFERENCES "currencies"("isoCode") ON DELETE CASCADE,
    FOREIGN KEY("bwId") REFERENCES "businessWallets"("id") ON DELETE CASCADE,
    FOREIGN KEY("senderWalletId") REFERENCES "wallets"("id") ON DELETE CASCADE,
    FOREIGN KEY("receiverWalletId") REFERENCES "wallets"("id") ON DELETE CASCADE
);


-- Down Migration
DROP TABLE "transactions";

DROP TABLE "customers";

DROP TABLE "walletChargeStacks";

DROP TABLE "chargeStacks";

DROP TABLE "wallets";

DROP TABLE "businessWallets";

DROP TABLE "businesses";

DROP TABLE "countries";

DROP TABLE "currencies";

DROP TABLE "accounts";

DROP TYPE IF EXISTS TRANSACTIONCHANNEL;

DROP TYPE IF EXISTS TRANSACTIONSTATUS;

DROP TYPE IF EXISTS TRANSACTIONTYPE;

DROP TYPE IF EXISTS CHARGETYPE;

DROP TYPE IF EXISTS PAIDBY;




