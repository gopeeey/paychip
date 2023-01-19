import { StandardCountryDto } from "../../contracts/dtos";
import { Country } from "../../db/models";

export const countryData = { isoCode: "NGA", name: "Nigeria" };
export const countryObj = new Country(countryData);
export const countryJson = countryObj.toJSON();
export const standardCountry = new StandardCountryDto(countryJson);
export const countryObjArray = [countryObj];
export const countryJsonArray = [countryJson];
export const standardCountryArray = [standardCountry];
export const countryCodes = [countryJson.isoCode];
