import { CountryModelInterface, CreateCountryDto, StandardCountryDto } from "@logic/country";
import { Country } from "@data/country";
import { currencySeeder } from "./currency.samples";
import { Pool } from "pg";
import { runQuery } from "@data/db";
import SQL from "sql-template-strings";
import { CurrencyModelInterface } from "@logic/currency";
import { SeedingError } from "../test_utils";
import { createQuery } from "@data/country/queries";

export const countryData = new CreateCountryDto({
    isoCode: "NGA",
    name: "Nigeria",
    currencyCode: "NGN",
});
export const countryObj = new Country(countryData);
export const countryJson = countryObj.toJSON();
export const standardCountry = new StandardCountryDto(countryJson);
export const countryObjArray = [countryObj];
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

    await runQuery(createQuery({ ...countryData, currencyCode: currency.isoCode }), pool);
};

export const getACountry = async (pool: Pool) => {
    const query = SQL`SELECT * FROM countries LIMIT 1;`;
    const res = await runQuery<CountryModelInterface>(query, pool);
    const country = res.rows[0];
    if (!country) throw new SeedingError("No currencies found");
    return country;
};
