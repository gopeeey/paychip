import { CreateBusinessDto, CreateWalletDto } from "../../../../dtos";
import {
    AccountModelInterface,
    BusinessModelInterface,
    BusinessRepoInterface,
    CountryModelInterface,
    WalletModelInterface,
} from "../../../db";

export interface BusinessCreatorInterface {
    create: (createBusinessDto: CreateBusinessDto) => Promise<BusinessModelInterface>;
}

export interface BusinessCreatorDependencies {
    repo: BusinessRepoInterface;
    getOwner: (ownerId: AccountModelInterface["id"]) => Promise<AccountModelInterface>;
    getCountry: (countryCode: CountryModelInterface["isoCode"]) => Promise<CountryModelInterface>;
    createWallet: (createWalletDto: CreateWalletDto) => Promise<WalletModelInterface>;
}
