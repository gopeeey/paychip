import { CreateBusinessDto } from "../dtos";
import { BusinessModelInterface } from "./business.model.interface";
import { BusinessRepoInterface } from "./business.repo.interface";
import { CountryModelInterface } from "@country/logic";
import { CreateWalletDto, WalletModelInterface } from "@wallet/logic";
import { AccountModelInterface } from "@accounts/logic";
import { SessionInterface } from "@bases/logic";

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
        createBusinessWalletDto: CreateWalletDto,
        session: SessionInterface
    ) => Promise<WalletModelInterface>;
}
