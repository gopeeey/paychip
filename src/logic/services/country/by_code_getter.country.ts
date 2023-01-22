import {
    CountryByCodeGetterInterface,
    CountryModelInterface,
    CountryByCodeGetterDependenciesInterface,
} from "../../../contracts/interfaces";
import { StandardCountryDto } from "../../../contracts/dtos";
import { CountryNotFoundError } from "../../errors";

export class CountryByCodeGetter implements CountryByCodeGetterInterface {
    private readonly _repository: CountryByCodeGetterDependenciesInterface["repo"];

    constructor(private readonly _dependencies: CountryByCodeGetterDependenciesInterface) {
        this._repository = this._dependencies.repo;
    }

    getByCode = async (isoCode: CountryModelInterface["isoCode"]) => {
        const country = await this._repository.getByCode(isoCode);
        if (!country) throw new CountryNotFoundError();
        return new StandardCountryDto(country);
    };
}
