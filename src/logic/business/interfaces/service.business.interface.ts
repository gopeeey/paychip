import { CreateBusinessDto } from "../dtos";
import { BusinessRepoInterface } from "./business.repo.interface";
import { BusinessModelInterface } from "./business.model.interface";
import { AccountModelInterface } from "@logic/accounts";
import { CountryServiceInterface } from "@logic/country";
import { SessionInterface } from "@logic/session_interface";
import { BusinessWalletModelInterface, CreateBusinessWalletDto } from "@logic/business_wallet";

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
