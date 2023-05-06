-- Up Migration
INSERT INTO "currencies" 
(
    "isoCode", 
    "name", 
    "active", 
    "fundingCs", 
    "withdrawalCs", 
    "walletInCs", 
    "walletOutCs"
) VALUES ('NGN', 'Nigerian Naira', true, 
'[
    {
        "flatCharge": 100,
        "minimumPrincipalAmount": 0,
        "percentageCharge": 3,
        "percentageChargeCap": 2000
    }
]',
'[
    {
        "flatCharge": 50,
        "minimumPrincipalAmount": 0,
        "percentageCharge": 0,
        "percentageChargeCap": 0
    }
]',
'[
    {
        "flatCharge": 0,
        "minimumPrincipalAmount": 0,
        "percentageCharge": 0,
        "percentageChargeCap": 0
    }
]',
'[
    {
        "flatCharge": 0,
        "minimumPrincipalAmount": 0,
        "percentageCharge": 0,
        "percentageChargeCap": 0
    }
]'
);
INSERT INTO "countries" 
("isoCode", "name", "currencyCode", "active")
VALUES
('NGA', 'Nigeria', 'NGN', true);

-- Down Migration
DELETE FROM "countries" WHERE "isoCode" = 'NGA';
DELETE FROM "currencies" WHERE "isoCode" = 'NGN';