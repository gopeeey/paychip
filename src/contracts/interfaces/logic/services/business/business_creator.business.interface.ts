import { CreateBusinessDto, CreateWalletDto } from "../../../../dtos";
import {
    AccountModelInterface,
    BusinessModelInterface,
    BusinessRepoInterface,
    CountryModelInterface,
    WalletModelInterface,
} from "../../../db";
import { CurrencyServiceInterface } from "../currency";

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
