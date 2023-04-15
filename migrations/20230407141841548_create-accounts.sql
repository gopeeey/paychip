-- Up Migration
CREATE TABLE accounts (
    "id" VARCHAR(60) PRIMARY KEY UNIQUE NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL UNIQUE,
    "password" VARCHAR(72) NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL 
);

-- Down Migration
DROP TABLE accounts;