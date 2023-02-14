import { CreateBusinessDto, StandardBusinessDto } from "../../../../dtos";
import { BusinessRepoInterface, BusinessModelInterface, AccountModelInterface } from "../../../db";
import { CountryServiceInterface } from "../country";
import { CurrencyServiceInterface } from "../currency";

export interface BusinessServiceInterface {
    createBusiness: (dto: CreateBusinessDto) => Promise<BusinessModelInterface>;
    getById: (id: BusinessModelInterface["id"]) => Promise<BusinessModelInterface>;
    getOwnerBusinesses: (ownerId: AccountModelInterface["id"]) => Promise<BusinessModelInterface[]>;
}

export interface BusinessServiceDependenciesInterface {
    repo: BusinessRepoInterface;
    getCountry: CountryServiceInterface["getByCode"];
    updateCurrencies: CurrencyServiceInterface["updateBusinessCurrencies"];
}
