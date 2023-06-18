import { CreateWalletDto, StandardWalletDto, WalletModelInterface } from "@wallet/logic";
import { createWalletQuery } from "@wallet/data";
import { SeedingError } from "../test_utils";
import { generateId } from "src/utils";
import { bwJson, bwSeeder, getABusinessWalletByBusinessId } from "./business_wallet.samples";
import { Pool } from "pg";
import { getABusiness } from "./business.samples";
import { getACountry } from "./country.samples";
import { runQuery } from "@data/db";
import SQL from "sql-template-strings";

export const walletData = new CreateWalletDto({
    businessId: 1234,
    currency: "NGN",
    email: "sammygopeh@gmail.com",
    businessWalletId: bwJson.id,
    waiveFundingCharges: false,
    waiveWithdrawalCharges: false,
    waiveWalletInCharges: false,
    waiveWalletOutCharges: false,
});

export const walletJson: WalletModelInterface = {
    ...walletData,
    id: "parentwallet",
    active: true,
    balance: 0,
};

export const standardWallet = new StandardWalletDto(walletJson);

export const walletSeeder = async (pool: Pool) => {
    await bwSeeder(pool);
    const business = await getABusiness(pool);
    const businessWallet = await getABusinessWalletByBusinessId(pool, business.id);
    const country = await getACountry(pool, business.countryCode);

    const data = new CreateWalletDto({
        businessId: business.id,
        currency: country.currencyCode,
        businessWalletId: businessWallet.id,
        email: "sammygopeh@gmail.com",
        waiveFundingCharges: false,
        waiveWithdrawalCharges: false,
        waiveWalletInCharges: false,
        waiveWalletOutCharges: false,
    });

    await runQuery(createWalletQuery({ ...data, id: generateId(business.id) }), pool);
};

export const getAWallet = async (pool: Pool, id?: WalletModelInterface["id"]) => {
    let query = SQL`SELECT * FROM "wallets" LIMIT 1;`;
    if (id) query = SQL`SELECT * FROM "wallets" WHERE "id" = ${id} LIMIT 1;`;
    const res = await runQuery<WalletModelInterface>(query, pool);
    const wallet = res.rows[0];
    if (!wallet) throw new SeedingError("No wallets found");
    return wallet;
};
