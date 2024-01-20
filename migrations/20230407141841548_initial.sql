-- Up Migration
CREATE TYPE PAIDBY AS ENUM ('wallet', 'customer');
CREATE TYPE CHARGETYPE AS ENUM ('funding', 'withdrawal', 'walletIn', 'walletOut');
CREATE TYPE TRANSACTIONTYPE AS ENUM ('credit', 'debit');
CREATE TYPE TRANSACTIONSTATUS AS ENUM ('pending', 'successful', 'failed', 'retrying');
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
    "balance" NUMERIC(15, 2) NOT NULL DEFAULT 0,
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
    "businessWalletId" VARCHAR(60),
    "currency" VARCHAR(3) NOT NULL,
    "isBusinessWallet" BOOLEAN NOT NULL DEFAULT FALSE,
    "active" BOOLEAN NOT NULL DEFAULT TRUE,
    "balance" NUMERIC(15, 2) NOT NULL DEFAULT 0,
    "email" VARCHAR(100) NOT NULL,
    "customFundingCs" VARCHAR,
    "customWithdrawalCs" VARCHAR,
    "customWalletInCs" VARCHAR,
    "customWalletOutCs" VARCHAR,
    "waiveFundingCharges" BOOLEAN NOT NULL DEFAULT FALSE,
    "waiveWithdrawalCharges" BOOLEAN NOT NULL DEFAULT FALSE,
    "waiveWalletInCharges" BOOLEAN NOT NULL DEFAULT FALSE,
    "waiveWalletOutCharges" BOOLEAN NOT NULL DEFAULT FALSE,
    "w_fundingCs" VARCHAR,
    "w_withdrawalCs" VARCHAR,
    "w_walletInCs" VARCHAR,
    "w_walletOutCs" VARCHAR,
    "w_fundingChargesPaidBy" PAIDBY,
    "w_withdrawalChargesPaidBy" PAIDBY,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE,
    FOREIGN KEY("businessWalletId") REFERENCES "wallets"("id") ON DELETE CASCADE,
    FOREIGN KEY("currency") REFERENCES "currencies"("isoCode") ON DELETE RESTRICT,
    UNIQUE("businessId", "currency", "email", "isBusinessWallet")
);

CREATE TABLE "chargeStacks" (
    "id" VARCHAR(60) PRIMARY KEY NOT NULL,
    "businessId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(140),
    "charges" VARCHAR NOT NULL,
    "paidBy" PAIDBY,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE
);

CREATE TABLE "walletChargeStacks" (
    "chargeStackId" VARCHAR(60) NOT NULL,
    "walletId" VARCHAR(60) NOT NULL,
    "chargeType" CHARGETYPE NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE("walletId", "chargeType"),
    FOREIGN KEY("chargeStackId") REFERENCES "chargeStacks"("id") ON DELETE CASCADE,
    FOREIGN KEY("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE
);

CREATE TABLE "customers" (
    "id" VARCHAR(60) PRIMARY KEY NOT NULL,
    "businessId" INTEGER NOT NULL,
    "name" VARCHAR(100),
    "firstName" VARCHAR(50),
    "lastName" VARCHAR(50),
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE("businessId", "email"),
    FOREIGN KEY("businessId") REFERENCES "businesses"("id") ON DELETE SET NULL
);

CREATE TABLE "walletCustomers" (
    "walletId" VARCHAR(60) NOT NULL,
    "customerId" VARCHAR(60) NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "transactions" (
    "id" VARCHAR(60) PRIMARY KEY NOT NULL,
    "businessId" INTEGER NOT NULL,
    "customerId" VARCHAR(60),
    "transactionType" TRANSACTIONTYPE NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "bwId" VARCHAR(60),
    "status" TRANSACTIONSTATUS NOT NULL DEFAULT 'pending',
    "channel" TRANSACTIONCHANNEL,
    "amount" NUMERIC(15, 2) NOT NULL,
    "settledAmount" NUMERIC(15, 2) NOT NULL,
    "senderPaid" NUMERIC(15, 2) NOT NULL DEFAULT 0,
    "receiverPaid" NUMERIC(15, 2) NOT NULL DEFAULT 0,
    "businessPaid" NUMERIC(15, 2) NOT NULL DEFAULT 0,
    "businessCharge" NUMERIC(15, 2) NOT NULL DEFAULT 0,
    "platformCharge" NUMERIC(15, 2) NOT NULL DEFAULT 0,
    "businessGot" NUMERIC(15, 2) NOT NULL DEFAULT 0,
    "platformGot" NUMERIC(15, 2) NOT NULL DEFAULT 0,
    "businessChargePaidBy" PAIDBY,
    "platformChargePaidBy" PAIDBY NOT NULL,
    "senderWalletId" VARCHAR(60),
    "receiverWalletId" VARCHAR(60),
    "reference" VARCHAR NOT NULL UNIQUE,
    "provider" VARCHAR(20),
    "providerRef" VARCHAR,
    "bankName" VARCHAR,
    "accountNumber" VARCHAR(20),
    "bankCode" VARCHAR(10),
    "accountName" VARCHAR(100),
    "cardNumber" VARCHAR(20),
    "cardType" VARCHAR(10),
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "callbackUrl" VARCHAR,
    "retryAt" TIMESTAMPTZ,
    "retries" INTEGER DEFAULT 0,
    FOREIGN KEY("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE,
    FOREIGN KEY("customerId") REFERENCES "customers"("id") ON DELETE SET NULL,
    FOREIGN KEY("currency") REFERENCES "currencies"("isoCode") ON DELETE CASCADE,
    FOREIGN KEY("bwId") REFERENCES "wallets"("id") ON DELETE CASCADE,
    FOREIGN KEY("senderWalletId") REFERENCES "wallets"("id") ON DELETE CASCADE,
    FOREIGN KEY("receiverWalletId") REFERENCES "wallets"("id") ON DELETE CASCADE
);

CREATE TABLE "paystackTransferRecipients" (
    "recipientId" VARCHAR,
    "accountNumber" VARCHAR(20),
    "bankCode" VARCHAR(10),
    "currency" VARCHAR(3)
);


-- Down Migration
DROP TABLE "paystackTransferRecipients";

DROP TABLE "transactions";

DROP TABLE "walletCustomers";

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




