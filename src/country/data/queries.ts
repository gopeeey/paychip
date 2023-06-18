import { CountryModelInterface } from "@country/logic";
import SQL from "sql-template-strings";

export const createQuery = (country: CountryModelInterface) => {
    return SQL`
        INSERT INTO countries 
        ("isoCode", "name", "currencyCode") 
        VALUES 
        (${country.isoCode}, ${country.name}, ${country.currencyCode})
        RETURNING *;
    `;
};

export const getByCodeQuery = (countryCode: CountryModelInterface["isoCode"]) => {
    return SQL`
        SELECT * FROM countries WHERE "isoCode" = ${countryCode};
    `;
};

export const getAllQuery = () => {
    return SQL`
        SELECT * FROM countries;
    `;
};
