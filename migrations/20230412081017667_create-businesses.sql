-- Up Migration
CREATE TABLE businesses (
    "id" SERIAL PRIMARY KEY UNIQUE NOT NULL,
    "ownerId" VARCHAR(60) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "countryCode" VARCHAR(3) NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL 
);

-- Down Migration
DROP TABLE businesses;