import { Account } from "@data/account";
import { Business } from "@data/business";
import { CreateBusinessDto, StandardBusinessDto } from "@logic/business";
import { accountJson, accountSeeder } from "./account.samples";
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
    await currencySeeder();
    const account = await Account.findOne();
    if (!account) throw new Error("BUSINESS SEEDER: Could not create account");
    await Business.create({ ...businessData, ownerId: account.id });
};
