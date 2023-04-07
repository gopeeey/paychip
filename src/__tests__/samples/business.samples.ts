import { Account } from "@data/accounts";
import { Business } from "@data/business";
import { Country } from "@data/country";
import { CreateBusinessDto, StandardBusinessDto } from "@logic/business";
import { SeedingError } from "../test_utils";
import { accountJson, accountSeeder } from "./accounts.samples";
import { countryJson, countrySeeder } from "./country.samples";
import { currencyJsonArr, currencySeeder } from "./currency.samples";

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

export const businessSeeder = async () => {
    await accountSeeder();
    await countrySeeder();
    const account = await Account.findOne();
    const country = await Country.findOne();
    if (!account) throw new Error("BUSINESS SEEDER: Could not create account");
    if (!country) throw new SeedingError("Country not found");
    await Business.create({ ...businessData, ownerId: account.id, countryCode: country.isoCode });
};
