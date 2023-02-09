import { Business } from "../../db/models";
import { CreateBusinessDto, StandardBusinessDto } from "../../contracts/dtos";
import { accountJson } from "./account.samples";
import { countryJson } from "./country.samples";
import { currencyJsonArr } from "./currency.samples";

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
