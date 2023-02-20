import { Country } from "../../db/models";
import { CountryRepo } from "../../db/repos";

export const countryRepo = new CountryRepo(Country);
