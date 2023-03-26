import { CreateBusinessDto } from "../dtos";
import { BusinessModelInterface } from "./business.model.interface";
import { BusinessRepoInterface } from "./business.repo.interface";
import { CountryModelInterface } from "@logic/country";
import { CurrencyServiceInterface } from "@logic/currency";
import { CreateWalletDto, WalletModelInterface, WalletServiceInterface } from "@logic/wallet";
import { AccountModelInterface } from "@logic/account";
import { SessionInterface } from "@logic/session_interface";
import { BusinessWalletModelInterface, CreateBusinessWalletDto } from "@logic/business_wallet";

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
    updateCurrencies: () => Promise<void>;
}
