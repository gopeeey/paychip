import { CreateCurrencyDto, CurrencyModelInterface, StandardCurrencyDto } from "@logic/currency";
import { Currency, createCurrencyQuery } from "@data/currency";
import { ChargeDto } from "@logic/charges";
import { Pool } from "pg";
import { runQuery } from "@data/db";
import SQL from "sql-template-strings";
import { SeedingError } from "../test_utils";

export const currencyData: CreateCurrencyDto = new CreateCurrencyDto({
    name: "Nigerian Naira",
    isoCode: "NGN",
    fundingCs: JSON.stringify(
        new ChargeDto({
            flatCharge: 1000,
            minimumPrincipalAmount: 0,
            percentageCharge: 2,
            percentageChargeCap: 400000,
        })
    ),
    withdrawalCs: JSON.stringify(
        new ChargeDto({
            flatCharge: 500,
            minimumPrincipalAmount: 0,
            percentageCharge: 1,
            percentageChargeCap: 400000,
        })
    ),
    walletInCs: JSON.stringify(
        new ChargeDto({
            flatCharge: 0,
            minimumPrincipalAmount: 0,
            percentageCharge: 0,
            percentageChargeCap: 0,
        })
    ),
    walletOutCs: JSON.stringify(
        new ChargeDto({
            flatCharge: 0,
            minimumPrincipalAmount: 0,
            percentageCharge: 0,
            percentageChargeCap: 0,
        })
    ),
});

export const currencyObj = new Currency({ ...currencyData, active: true });

export const currencyObjArr = [currencyObj];

export const currencyJson = currencyObj.toJSON();

export const currencyJsonArr = [currencyJson];

export const standardCurrency = new StandardCurrencyDto(currencyJson);
export const standardCurrencyArr = [standardCurrency];

export const currencySeeder = async (pool: Pool) => {
    const query = createCurrencyQuery(currencyData);
    await runQuery(query, pool);

    // await Currency.create({
    //     name: "Nigerian Naira",
    //     isoCode: "NGN",
    //     fundingCs: JSON.stringify(
    //         new ChargeDto({
    //             flatCharge: 1000,
    //             minimumPrincipalAmount: 0,
    //             percentageCharge: 2,
    //             percentageChargeCap: 400000,
    //         })
    //     ),
    //     withdrawalCs: JSON.stringify(
    //         new ChargeDto({
    //             flatCharge: 500,
    //             minimumPrincipalAmount: 0,
    //             percentageCharge: 1,
    //             percentageChargeCap: 400000,
    //         })
    //     ),
    //     walletInCs: JSON.stringify(
    //         new ChargeDto({
    //             flatCharge: 0,
    //             minimumPrincipalAmount: 0,
    //             percentageCharge: 0,
    //             percentageChargeCap: 0,
    //         })
    //     ),
    //     walletOutCs: JSON.stringify(
    //         new ChargeDto({
    //             flatCharge: 0,
    //             minimumPrincipalAmount: 0,
    //             percentageCharge: 0,
    //             percentageChargeCap: 0,
    //         })
    //     ),
    // });
};

export const getACurrency = async (pool: Pool, isoCode?: CurrencyModelInterface["isoCode"]) => {
    let query = SQL`SELECT * FROM currencies LIMIT 1;`;
    if (isoCode) query = SQL`SELECT * FROM currencies WHERE "isoCode" = ${isoCode} LIMIT 1;`;
    const res = await runQuery<CurrencyModelInterface>(query, pool);
    const currency = res.rows[0];
    if (!currency) throw new SeedingError("No currencies found");
    return currency;
};
