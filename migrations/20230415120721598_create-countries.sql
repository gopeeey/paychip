-- Up Migration
CREATE TABLE countries (
    "isoCode" VARCHAR(3) PRIMARY KEY UNIQUE NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "currencyCode" VARCHAR(3) NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL 
);

-- Down Migration
DROP TABLE countries;