import { CountryService } from "../../logic/services";
import { countryRepo } from "./repo.country";
import { CountryByCodeGetter, CountrySupportedChecker } from "../../logic/services";
import { businessRepo } from "../business";

const countryByCodeGetter = new CountryByCodeGetter({ repo: countryRepo });
const checkCountrySupported = new CountrySupportedChecker({
    getCountryByCode: countryByCodeGetter.getByCode,
}).check;

export const countryService = new CountryService({
    repo: countryRepo,
    getCountryByCode: countryByCodeGetter.getByCode,
});

console.log("\n\n\nBUSINESS REPO", businessRepo);
