import { CreateBusinessDto, CreateWalletDto } from "../../../../dtos";
import {
    BusinessRepoInterface,
    BusinessModelInterface,
    AccountModelInterface,
    WalletModelInterface,
} from "../../../db";
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
    createWallet: (createWalletDto: CreateWalletDto) => Promise<WalletModelInterface>;
    getAccount: (accountId: AccountModelInterface["id"]) => Promise<AccountModelInterface>;
}
