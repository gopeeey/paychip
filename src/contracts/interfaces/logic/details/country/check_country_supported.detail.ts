import { CountryModelInterface, CountryRepoInterface } from "../../../db";

export type CheckCountrySupportedType = (
    repo: CountryRepoInterface,
    isoCode: CountryModelInterface["isoCode"]
) => Promise<boolean>;
