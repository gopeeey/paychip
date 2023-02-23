import { CreateBusinessWalletDto, CreateWalletDto } from "../../../../dtos";
import { CurrencyModelInterface, WalletModelInterface, WalletRepoInterface } from "../../../db";

export interface WalletServiceInterface {
    createWallet: (createWalletDto: CreateWalletDto) => Promise<WalletModelInterface>;
    createBusinessWallet: (createWalletDto: CreateWalletDto) => Promise<WalletModelInterface>;
}

export interface WalletServiceDependencies {
    repo: WalletRepoInterface;
    isSupportedBusinessCurrency: (
        businessId: WalletModelInterface["businessId"],
        currencyCode: WalletModelInterface["currency"]
    ) => Promise<boolean>;
}
