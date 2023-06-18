import { CountryModelInterface, CreateCountryDto, StandardCountryDto } from "@country/logic";
import { createQuery } from "@country/data";
import { currencySeeder } from "./currency.samples";
import { Pool } from "pg";
import { runQuery } from "@data/db";
import SQL from "sql-template-strings";
import { CurrencyModelInterface } from "@currency/logic";
import { SeedingError } from "../test_utils";

export const countryData = new CreateCountryDto({
    isoCode: "NGA",
    name: "Nigeria",
    currencyCode: "NGN",
});

export const countryJson: CountryModelInterface = { ...countryData, active: true };
export const standardCountry = new StandardCountryDto(countryJson);
export const countryJsonArray = [countryJson];
export const standardCountryArray = [standardCountry];
export const countryCodes = [countryJson.isoCode];

export const countrySeeder = async (pool: Pool) => {
    await currencySeeder(pool);
    const res = await runQuery<CurrencyModelInterface>(
        SQL`SELECT * FROM currencies LIMIT 1;`,
        pool
    );
    const currency = res.rows[0];

    await runQuery(
        createQuery({ ...countryData, currencyCode: currency.isoCode, active: true }),
        pool
    );
};

export const getACountry = async (pool: Pool, isoCode?: CountryModelInterface["isoCode"]) => {
    let query = SQL`SELECT * FROM countries LIMIT 1;`;
    if (isoCode) query = SQL`SELECT * FROM countries WHERE "isoCode" = ${isoCode} LIMIT 1;`;
    const res = await runQuery<CountryModelInterface>(query, pool);
    const country = res.rows[0];
    if (!country) throw new SeedingError("No currencies found");
    return country;
};
