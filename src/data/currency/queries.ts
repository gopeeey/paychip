import { CurrencyModelInterface } from "@logic/currency";
import SQL from "sql-template-strings";

export const createCurrencyQuery = (currency: CurrencyModelInterface) => {
    return SQL`
        INSERT INTO currencies 
        ("isoCode", "name", "active", "fundingCs", "withdrawalCs", "walletInCs", "walletOutCs")
        VALUES
        (
            ${currency.isoCode}, 
            ${currency.name}, 
            ${currency.active}, 
            ${currency.fundingCs}, 
            ${currency.withdrawalCs}, 
            ${currency.walletInCs}, 
            ${currency.walletOutCs}
        );
    `;
};

export const getAllQuery = () => {
    return SQL`
        SELECT * FROM currencies;
    `;
};

export const getActiveQuery = () => {
    return SQL`
        SELECT * FROM currencies WHERE active = true;
    `;
};