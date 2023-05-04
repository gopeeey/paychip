import { createBusinessWalletQuery } from "@data/business_wallet";
import { BusinessWalletModelInterface, CreateBusinessWalletDto } from "@logic/business_wallet";
import { generateId } from "src/utils";
import { businessJson, businessSeeder, getABusiness } from "./business.samples";
import { currencyJson, getACurrency } from "./currency.samples";
import { Pool } from "pg";
import { runQuery } from "@data/db";
import { getACountry } from "./country.samples";
import SQL from "sql-template-strings";
import { SeedingError } from "../test_utils";

export const bwData = new CreateBusinessWalletDto({
    businessId: businessJson.id,
    currencyCode: currencyJson.isoCode,
});

export const bwJson: BusinessWalletModelInterface = {
    ...bwData,
    id: "something",
    balance: 0,
    customFundingCs: "[]",
    customWithdrawalCs: "[]",
    customWalletInCs: "[]",
    customWalletOutCs: "[]",
    fundingChargesPaidBy: "wallet",
    withdrawalChargesPaidBy: "wallet",
    w_fundingCs: "[]",
    w_withdrawalCs: "[]",
    w_walletInCs: "[]",
    w_walletOutCs: "[]",
    w_fundingChargesPaidBy: "wallet",
    w_withdrawalChargesPaidBy: "wallet",
};

export const bwSeeder = async (pool: Pool) => {
    await businessSeeder(pool);
    const business = await getABusiness(pool);
    const country = await getACountry(pool, business.countryCode);
    const currency = await getACurrency(pool, country.currencyCode);

    const data = {
        businessId: business.id,
        currencyCode: currency.isoCode,
        id: generateId(business.id),
    };
    await runQuery(createBusinessWalletQuery(data), pool);
};

export const getABusinessWallet = async (pool: Pool) => {
    const res = await runQuery<BusinessWalletModelInterface>(
        SQL`SELECT * FROM "businessWallets" LIMIT 1;`,
        pool
    );
    const bw = res.rows[0];
    if (!bw) throw new SeedingError("No business wallets found");
    return bw;
};

export const getABusinessWalletByBusinessId = async (
    pool: Pool,
    businessId?: BusinessWalletModelInterface["businessId"]
) => {
    let query = SQL`SELECT * FROM "businessWallets" LIMIT 1;`;
    if (businessId) query = SQL`SELECT * FROM "businessWallets" WHERE "businessId" = ${businessId}`;
    const res = await runQuery<BusinessWalletModelInterface>(query, pool);
    const bw = res.rows[0];
    if (!bw) throw new SeedingError("No business wallets found");
    return bw;
};
