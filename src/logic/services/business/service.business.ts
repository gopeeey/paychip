import { CreateBusinessDto, StandardBusinessDto } from "../../../contracts/dtos";
import {
    BusinessServiceInterface,
    BusinessServiceDependenciesInterface,
    BusinessModelInterface,
    AccountModelInterface,
} from "../../../contracts/interfaces";
import { BusinessNotFoundError, CountryNotSuportedError } from "../../errors";

export class BusinessService implements BusinessServiceInterface {
    private readonly _repository: BusinessServiceDependenciesInterface["repo"];

    constructor(private readonly _dependencies: BusinessServiceDependenciesInterface) {
        this._repository = this._dependencies.repo;
    }

    createBusiness = async (createBusinessDto: CreateBusinessDto) => {
        // check if country is supported
        console.log("\n\n\nFROM BUSINESS SERVICE", this._dependencies.getCountry);
        const country = await this._dependencies.getCountry(createBusinessDto.countryCode);
        if (!country) throw new CountryNotSuportedError();

        // create business
        const business = await this._repository.create(createBusinessDto);

        // add the currency of the country to the business currencies
        const currencies = await this._dependencies.updateCurrencies(business.id, [
            country.currencyCode,
        ]);

        return new StandardBusinessDto({ ...business, currencies });
    };

    getById = async (id: BusinessModelInterface["id"]) => {
        const business = await this._repository.findById(id);
        if (!business) throw new BusinessNotFoundError();
        return new StandardBusinessDto(business);
    };

    getOwnerBusinesses = async (ownerId: AccountModelInterface["id"]) => {
        const businesses = await this._repository.getOwnerBusinesses(ownerId);
        return businesses.map((business) => new StandardBusinessDto(business));
    };
}
