import { Country } from "../../db/models";
import { CountryRepo } from "../../db/repos";

export const countryRepo = new CountryRepo(Country);
console.log("\n\n\nFROM COUNTRY REPO", (async () => await countryRepo.getByCode("NGA"))());
