import { CreateBusinessDto } from "../dtos";
import { CreateWalletDto, WalletModelInterface } from "@logic/wallet";
import { BusinessRepoInterface } from "./business.repo.interface";
import { BusinessModelInterface } from "./business.model.interface";
import { AccountModelInterface } from "@logic/account";
import { CountryServiceInterface } from "@logic/country";
import { CurrencyServiceInterface } from "@logic/currency";

export interface BusinessServiceInterface {
    createBusiness: (dto: CreateBusinessDto) => Promise<BusinessModelInterface>;
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
    getCountry: CountryServiceInterface["getByCode"];
    updateCurrencies: CurrencyServiceInterface["updateBusinessCurrencies"];
    createWallet: (createWalletDto: CreateWalletDto) => Promise<WalletModelInterface>;
    getAccount: (accountId: AccountModelInterface["id"]) => Promise<AccountModelInterface>;
}
