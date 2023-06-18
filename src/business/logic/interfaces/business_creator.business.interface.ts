import { CreateBusinessDto } from "../dtos";
import { BusinessModelInterface } from "./business.model.interface";
import { BusinessRepoInterface } from "./business.repo.interface";
import { CountryModelInterface } from "@country/logic";
import { CurrencyServiceInterface } from "@currency/logic";
import { CreateWalletDto, WalletModelInterface, WalletServiceInterface } from "@wallet/logic";
import { AccountModelInterface } from "@accounts/logic";
import { SessionInterface } from "@bases/logic";
import { BusinessWalletModelInterface, CreateBusinessWalletDto } from "@business_wallet/logic";

export interface BusinessCreatorInterface {
    create: () => Promise<BusinessModelInterface>;
}

export interface BusinessCreatorDependencies {
    dto: CreateBusinessDto;
    repo: BusinessRepoInterface;
    session: SessionInterface;
    getOwner: (ownerId: BusinessModelInterface["ownerId"]) => Promise<AccountModelInterface>;
    getCountry: (
        countryCode: BusinessModelInterface["countryCode"]
    ) => Promise<CountryModelInterface>;
    createBusinessWallet: (
        createBusinessWalletDto: CreateBusinessWalletDto,
        session: SessionInterface
    ) => Promise<BusinessWalletModelInterface>;
}
