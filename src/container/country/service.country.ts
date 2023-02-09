import { CountryService } from "../../logic/services";
import { countryRepo } from "./repo.country";

export const countryService = new CountryService({ repo: countryRepo });

export const getCountry = countryService.getByCode;

console.log("\n\n\nFROM COUNTRY SERVICE", getCountry("NGA"));
