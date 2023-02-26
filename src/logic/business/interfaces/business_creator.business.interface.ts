import { CreateBusinessDto } from "../dtos";
import { CreateWalletDto, WalletModelInterface } from "@logic/wallet";

import { AccountModelInterface } from "@logic/account";
import { BusinessModelInterface } from "./business.model.interface";
import { BusinessRepoInterface } from "./business.repo.interface";
import { CountryModelInterface } from "@logic/country";

import { CurrencyServiceInterface } from "@logic/currency";

export interface BusinessCreatorInterface {
    create: () => Promise<BusinessModelInterface>;
}

export interface BusinessCreatorDependencies {
    dto: CreateBusinessDto;
    repo: BusinessRepoInterface;
    getOwner: (ownerId: AccountModelInterface["id"]) => Promise<AccountModelInterface>;
    getCountry: (countryCode: CountryModelInterface["isoCode"]) => Promise<CountryModelInterface>;
    createWallet: (createWalletDto: CreateWalletDto) => Promise<WalletModelInterface>;
    updateCurrencies: CurrencyServiceInterface["updateBusinessCurrencies"];
}
