import { CreateCountryDto, StandardCountryDto } from "../../../contracts/dtos";
import { CountryRepoInterface } from "../../../contracts/interfaces/db_logic";
import { CountryServiceInterface } from "../../../contracts/interfaces/logic_web";
import { CountryNotFoundError } from "../../errors";

export class CountryService implements CountryServiceInterface {
    constructor(private readonly _repository: CountryRepoInterface) {}

    async create(dto: CreateCountryDto) {
        const country = await this._repository.create(dto);
        return new StandardCountryDto(country);
    }
    async getByCode(isoCode: string) {
        const country = await this._repository.getByCode(isoCode);
        if (!country) throw new CountryNotFoundError();
        return new StandardCountryDto(country);
    }
}
