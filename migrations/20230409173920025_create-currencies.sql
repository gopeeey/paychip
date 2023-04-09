-- Up Migration
CREATE TABLE currencies (
    "isoCode" VARCHAR(4) PRIMARY KEY NOT NULL UNIQUE,
    "name" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT TRUE,
    "fundingCs" VARCHAR NOT NULL,
    "withdrawalCs" VARCHAR NOT NULL,
    "walletInCs" VARCHAR NOT NULL,
    "walletOutCs" VARCHAR NOT NULL
);

-- Down Migration
DROP TABLE currencies;