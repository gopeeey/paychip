import {
    CountryModelInterface,
    CountrySupportedCheckerInterface,
    CountrySupportedCheckerDependenciesInterface,
} from "../../../contracts/interfaces";
import { CountryNotFoundError } from "../../errors";

export class CountrySupportedChecker implements CountrySupportedCheckerInterface {
    constructor(private readonly _dependencies: CountrySupportedCheckerDependenciesInterface) {}

    check = async (isoCode: CountryModelInterface["isoCode"]) => {
        try {
            await this._dependencies.getCountryByCode(isoCode);
            return true;
        } catch (err) {
            if (err instanceof CountryNotFoundError) return false;
            throw err;
        }
    };
}
