import { CreateCountryDto, StandardCountryDto } from "@logic/country";
import { Country } from "@data/country";

export const countryData = new CreateCountryDto({
    isoCode: "NGA",
    name: "Nigeria",
    currencyCode: "NGN",
});
export const countryObj = new Country(countryData);
export const countryJson = countryObj.toJSON();
export const standardCountry = new StandardCountryDto(countryJson);
export const countryObjArray = [countryObj];
export const countryJsonArray = [countryJson];
export const standardCountryArray = [standardCountry];
export const countryCodes = [countryJson.isoCode];
