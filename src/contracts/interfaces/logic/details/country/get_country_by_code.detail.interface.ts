import { StandardCountryDto } from "../../../../dtos";
import { CountryModelInterface, CountryRepoInterface } from "../../../db";

export type GetCountryByCodeType = (
    repo: CountryRepoInterface,
    isoCode: CountryModelInterface["isoCode"]
) => Promise<StandardCountryDto>;
