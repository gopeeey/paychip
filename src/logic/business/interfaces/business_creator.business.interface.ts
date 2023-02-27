import { CreateBusinessDto } from "../dtos";
import { BusinessModelInterface } from "./business.model.interface";
import { BusinessRepoInterface } from "./business.repo.interface";
import { CountryModelInterface } from "@logic/country";
import { CurrencyServiceInterface } from "@logic/currency";
import { CreateWalletDto, WalletModelInterface, WalletServiceInterface } from "@logic/wallet";
import { AccountModelInterface } from "@logic/account";
import { SessionInterface } from "@logic/session_interface";

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
    createWallet: WalletServiceInterface["createWallet"];
    updateCurrencies: CurrencyServiceInterface["updateBusinessCurrencies"];
}
