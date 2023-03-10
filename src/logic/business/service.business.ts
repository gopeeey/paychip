import { CreateBusinessDto } from "./dtos";
import {
    BusinessModelInterface,
    BusinessServiceInterface,
    BusinessServiceDependenciesInterface,
} from "./interfaces";
import { AccountModelInterface } from "@logic/account";
import { BusinessNotFoundError, UnauthorizedBusinessAccessError } from "./errors";
import { BusinessCreator } from "./creator.business";
import { generateAuthToken } from "src/utils";

export class BusinessService implements BusinessServiceInterface {
    private readonly _repository: BusinessServiceDependenciesInterface["repo"];

    constructor(private readonly _dep: BusinessServiceDependenciesInterface) {
        this._repository = this._dep.repo;
    }

    createBusiness = async (createBusinessDto: CreateBusinessDto) => {
        const business = await new BusinessCreator({
            dto: createBusinessDto,
            createWallet: this._dep.createWallet,
            getCountry: this._dep.getCountry,
            getOwner: this._dep.getAccount,
            repo: this._dep.repo,
            updateCurrencies: this._dep.updateCurrencies,
        }).create();

        return business;
    };

    getById = async (id: BusinessModelInterface["id"]) => {
        const business = await this._repository.findById(id);
        if (!business) throw new BusinessNotFoundError();
        return business;
    };

    getOwnerBusinesses = async (ownerId: AccountModelInterface["id"]) => {
        const businesses = await this._repository.getOwnerBusinesses(ownerId);
        return businesses;
    };

    getBusinessAccessToken: BusinessServiceInterface["getBusinessAccessToken"] = async (
        businessId,
        accountId
    ) => {
        const business = await this.getById(businessId);
        if (business.ownerId !== accountId) throw new UnauthorizedBusinessAccessError();
        const accessToken = generateAuthToken("business", { accountId, businessId: business.id });
        return accessToken;
    };
}
