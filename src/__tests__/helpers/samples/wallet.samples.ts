import { CreateWalletDto, StandardWalletDto, WalletModelInterface } from "@wallet/logic";
import { DbWallet, createWalletQuery } from "@wallet/data";
import { SeedingError } from "../test_utils";
import { generateId } from "src/utils";
import { Pool } from "pg";
import { businessSeeder, getABusiness } from "./business.samples";
import { getACountry } from "./country.samples";
import { runQuery } from "@db/postgres";
import SQL from "sql-template-strings";
import { BusinessModelInterface } from "@business/logic";

export const businessWalletData = new CreateWalletDto({
    businessId: 1234,
    currency: "NGN",
    email: "sammygopeh@gmail.com",
    waiveFundingCharges: false,
    waiveWithdrawalCharges: false,
    waiveWalletInCharges: false,
    waiveWalletOutCharges: false,
    businessWalletId: null,
    isBusinessWallet: true,
});

export const businessWalletJson: WalletModelInterface = {
    ...businessWalletData,
    id: "businessWallet",
    businessWalletId: null,
    isBusinessWallet: true,
    waiveFundingCharges: false,
    waiveWalletInCharges: false,
    waiveWithdrawalCharges: false,
    waiveWalletOutCharges: false,
    active: true,
    balance: 0,
    customFundingCs: null,
    customWalletInCs: null,
    customWalletOutCs: null,
    customWithdrawalCs: null,
    w_fundingChargesPaidBy: null,
    w_withdrawalChargesPaidBy: null,
    w_fundingCs: null,
    w_walletInCs: null,
    w_walletOutCs: null,
    w_withdrawalCs: null,
};

export const walletData = new CreateWalletDto({
    businessId: 1234,
    currency: "NGN",
    email: "sammygopeh@gmail.com",
    businessWalletId: businessWalletJson.id,
    waiveFundingCharges: false,
    waiveWithdrawalCharges: false,
    waiveWalletInCharges: false,
    waiveWalletOutCharges: false,
});

export const walletJson: WalletModelInterface = {
    ...walletData,
    id: "wallet",
    businessWalletId: businessWalletJson.id,
    isBusinessWallet: false,
    waiveFundingCharges: false,
    waiveWalletInCharges: false,
    waiveWithdrawalCharges: false,
    waiveWalletOutCharges: false,
    active: true,
    balance: 0,
    customFundingCs: null,
    customWalletInCs: null,
    customWalletOutCs: null,
    customWithdrawalCs: null,
    w_fundingChargesPaidBy: null,
    w_withdrawalChargesPaidBy: null,
    w_fundingCs: null,
    w_walletInCs: null,
    w_walletOutCs: null,
    w_withdrawalCs: null,
};

export const standardWallet = new StandardWalletDto(walletJson);
export const standardBusinessWallet = new StandardWalletDto(businessWalletJson);

export const getAWallet = async (pool: Pool, id?: WalletModelInterface["id"]) => {
    let query = SQL`SELECT * FROM "wallets" LIMIT 1;`;
    if (id) query = SQL`SELECT * FROM "wallets" WHERE "id" = ${id} LIMIT 1;`;
    const res = await runQuery<DbWallet>(query, pool);
    const wallet = res.rows[0];
    if (!wallet) throw new SeedingError("No wallets found");
    return wallet;
};

export const getABusinessWallet = async (pool: Pool, id?: WalletModelInterface["id"]) => {
    let query = SQL`SELECT * FROM "wallets" WHERE "isBusinessWallet" = true LIMIT 1;`;
    if (id)
        query = SQL`SELECT * FROM "wallets" WHERE "id" = ${id} AND "isBusinessWallet" = true LIMIT 1;`;
    const res = await runQuery<DbWallet>(query, pool);
    const wallet = res.rows[0];
    if (!wallet) throw new SeedingError("No business wallets found");
    return wallet;
};

export const getABusinessWalletByBusinessId = async (
    pool: Pool,
    businessId: BusinessModelInterface["id"]
) => {
    const query = SQL`SELECT * FROM "wallets" WHERE "businessId" = ${businessId} AND "isBusinessWallet" = true LIMIT 1;`;
    const res = await runQuery<DbWallet>(query, pool);
    const wallet = res.rows[0];
    if (!wallet) throw new SeedingError("No business wallets found");
    return wallet;
};

export const walletSeeder = async (pool: Pool) => {
    await businessSeeder(pool);
    const business = await getABusiness(pool);
    const country = await getACountry(pool, business.countryCode);

    const businessWalletData = new CreateWalletDto({
        businessId: business.id,
        currency: country.currencyCode,
        businessWalletId: null,
        isBusinessWallet: true,
        email: "sammygopeh@gmail.com",
    });

    await runQuery(createWalletQuery({ ...businessWalletData, id: generateId(business.id) }), pool);

    const businessWallet = await getABusinessWalletByBusinessId(pool, business.id);

    const walletData = new CreateWalletDto({
        businessId: business.id,
        currency: country.currencyCode,
        businessWalletId: businessWallet.id,
        email: "sammygopeh@gmail.com",
        waiveFundingCharges: false,
        waiveWithdrawalCharges: false,
        waiveWalletInCharges: false,
        waiveWalletOutCharges: false,
    });

    await runQuery(createWalletQuery({ ...walletData, id: generateId(business.id) }), pool);
};
