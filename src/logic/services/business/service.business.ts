import { CreateBusinessDto, StandardBusinessDto } from "../../../contracts/dtos";
import {
    BusinessServiceInterface,
    BusinessServiceDependenciesInterface,
    BusinessModelInterface,
} from "../../../contracts/interfaces";
import { BusinessNotFoundError, CountryNotSuportedError } from "../../errors";

export class BusinessService implements BusinessServiceInterface {
    private readonly _repository: BusinessServiceDependenciesInterface["repo"];

    constructor(private readonly _dependencies: BusinessServiceDependenciesInterface) {
        this._repository = this._dependencies.repo;
    }

    async createBusiness(createBusinessDto: CreateBusinessDto) {
        const countrySupported = await this._dependencies.checkCountrySupported(
            createBusinessDto.countryCode
        );
        if (!countrySupported) throw new CountryNotSuportedError();
        const business = await this._repository.create(createBusinessDto);
        return new StandardBusinessDto(business);
    }

    async getById(id: BusinessModelInterface["id"]) {
        const business = await this._repository.findById(id);
        if (!business) throw new BusinessNotFoundError();
        return new StandardBusinessDto(business);
    }
}