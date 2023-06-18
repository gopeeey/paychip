import { CreateBusinessDto } from "../dtos";
import { BusinessRepoInterface } from "./business.repo.interface";
import { BusinessModelInterface } from "./business.model.interface";
import { AccountModelInterface } from "@accounts/logic";
import { CountryServiceInterface } from "@country/logic";
import { SessionInterface } from "@bases/logic";
import { BusinessWalletModelInterface, CreateBusinessWalletDto } from "@business_wallet/logic";

export interface BusinessServiceInterface {
    createBusiness: (
        dto: CreateBusinessDto,
        session?: SessionInterface
    ) => Promise<BusinessModelInterface>;
    getById: (id: BusinessModelInterface["id"]) => Promise<BusinessModelInterface>;
    getOwnerBusinesses: (
        ownerId: BusinessModelInterface["ownerId"]
    ) => Promise<BusinessModelInterface[]>;
    getBusinessAccessToken: (
        businessId: BusinessModelInterface["id"],
        accountId: BusinessModelInterface["ownerId"]
    ) => Promise<string>;
}

export interface BusinessServiceDependenciesInterface {
    repo: BusinessRepoInterface;
    startSession: () => Promise<SessionInterface>;
    getCountry: CountryServiceInterface["getByCode"];
    createBusinessWallet: (
        createBusinessWalletDto: CreateBusinessWalletDto,
        session: SessionInterface
    ) => Promise<BusinessWalletModelInterface>;
    getAccount: (accountId: AccountModelInterface["id"]) => Promise<AccountModelInterface>;
}
