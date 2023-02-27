import { CreateBusinessDto } from "../dtos";
import { CreateWalletDto, WalletModelInterface, WalletServiceInterface } from "@logic/wallet";
import { BusinessRepoInterface } from "./business.repo.interface";
import { BusinessModelInterface } from "./business.model.interface";
import { AccountModelInterface } from "@logic/account";
import { CountryServiceInterface } from "@logic/country";
import { CurrencyServiceInterface } from "@logic/currency";
import { SessionInterface } from "@logic/session_interface";

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
    updateCurrencies: CurrencyServiceInterface["updateBusinessCurrencies"];
    createWallet: WalletServiceInterface["createWallet"];
    getAccount: (accountId: AccountModelInterface["id"]) => Promise<AccountModelInterface>;
}
