-- Up Migration
CREATE TYPE PAIDBY AS ENUM ('wallet', 'customer');
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
DROP TYPE IF EXISTS PAIDBY;