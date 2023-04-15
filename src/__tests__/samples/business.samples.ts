import { Business } from "@data/business";
import { BusinessModelInterface, CreateBusinessDto, StandardBusinessDto } from "@logic/business";
import { SeedingError } from "../test_utils";
import { accountJson, accountSeeder, getAnAccount } from "./accounts.samples";
import { countryJson, countrySeeder, getACountry } from "./country.samples";
import { currencyJsonArr } from "./currency.samples";
import { Pool } from "pg";
import { runQuery } from "@data/db";
import { createBusinessQuery } from "@data/business/queries";

export const businessData = new CreateBusinessDto({
    name: "My Business",
    ownerId: accountJson.id,
    countryCode: countryJson.isoCode,
});
export const businessObj = new Business({ ...businessData, id: 1234 });
export const businessObjArr = [businessObj];
export const businessJson = businessObj.toJSON();
export const businessJsonArr = [businessJson];
export const standardBusiness = new StandardBusinessDto(businessJson);
export const standardBusinessArr = [standardBusiness];
export const standardBusinessWithCurrencies = new StandardBusinessDto({
    ...standardBusiness,
    currencies: currencyJsonArr,
});

export const businessSeeder = async (pool: Pool) => {
    await accountSeeder(pool);
    await countrySeeder(pool);
    const account = await getAnAccount(pool);
    const country = await getACountry(pool);
    await runQuery(
        createBusinessQuery({ ...businessData, ownerId: account.id, countryCode: country.isoCode }),
        pool
    );
};

export const getABusiness = async (pool: Pool) => {
    const query = "SELECT * FROM businesses LIMIT 1;";
    const res = await runQuery<BusinessModelInterface>(query, pool);
    const business = res.rows[0];
    if (!business) throw new SeedingError("No businesses found");
    return business;
};
