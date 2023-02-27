import { SessionInterface } from "@logic/session_interface";
import { CreateWalletDto } from "../dtos";
import { WalletModelInterface } from "./wallet.model.interface";
import { WalletRepoInterface } from "./wallet.repo.interface";

export interface WalletServiceInterface {
    createWallet: (
        createWalletDto: CreateWalletDto,
        session?: SessionInterface
    ) => Promise<WalletModelInterface>;
    createBusinessWallet: (createWalletDto: CreateWalletDto) => Promise<WalletModelInterface>;
}

export interface WalletServiceDependencies {
    repo: WalletRepoInterface;
    isSupportedBusinessCurrency: (
        businessId: WalletModelInterface["businessId"],
        currencyCode: WalletModelInterface["currency"]
    ) => Promise<boolean>;
}
