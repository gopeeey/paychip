-- Up Migration
CREATE TABLE currencies (
    "isoCode" VARCHAR(3) PRIMARY KEY NOT NULL UNIQUE,
    "name" VARCHAR(100) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT TRUE,
    "fundingCs" VARCHAR NOT NULL,
    "withdrawalCs" VARCHAR NOT NULL,
    "walletInCs" VARCHAR NOT NULL,
    "walletOutCs" VARCHAR NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Down Migration
DROP TABLE currencies;