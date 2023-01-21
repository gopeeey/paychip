import { Business } from "../../db/models";
import { CreateBusinessDto, StandardBusinessDto } from "../../contracts/dtos";
import { accountJson } from "./account.samples";
import { countryJson } from "./country.samples";

export const businessData = new CreateBusinessDto({
    name: "My Business",
    ownerId: accountJson.id,
    countryCode: countryJson.isoCode,
});
export const businessObj = new Business(businessData);
export const businessJson = businessObj.toJSON();
export const standardBusiness = new StandardBusinessDto(businessJson);
