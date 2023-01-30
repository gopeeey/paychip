import { BusinessService } from "../../logic/services";
import { businessRepo } from "./repo.business";
import { countryRepo } from "../country";
import { CountryByCodeGetter, CountrySupportedChecker } from "../../logic/services";

const countryByCodeGetter = new CountryByCodeGetter({ repo: countryRepo });
const checkCountrySupported = new CountrySupportedChecker({
    getCountryByCode: countryByCodeGetter.getByCode,
}).check;

export const businessService = new BusinessService({
    repo: businessRepo,
    checkCountrySupported,
});

console.log("\n\n\nCOUNTRY CHECKER", checkCountrySupported);
console.log("\n\n\nCOUNTRY REPO", countryRepo);
