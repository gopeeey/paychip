import { SessionInterface } from "@logic/session_interface";
import { CreateWalletDto, GetUniqueWalletDto } from "../dtos";
import { WalletModelInterface } from "./wallet.model.interface";
import { WalletRepoInterface } from "./wallet.repo.interface";
import { BusinessWalletModelInterface as BwModelInterface } from "@logic/business_wallet";

export interface WalletServiceInterface {
    createWallet: (
        createWalletDto: CreateWalletDto,
        session?: SessionInterface
    ) => Promise<WalletModelInterface>;

    getWalletById: (id: WalletModelInterface["id"]) => Promise<WalletModelInterface>;
    getUniqueWallet: (uniqueData: GetUniqueWalletDto) => Promise<WalletModelInterface>;
}

export interface WalletServiceDependencies {
    repo: WalletRepoInterface;
    getBusinessWallet: (
        businessId: BwModelInterface["businessId"],
        currencyCode: BwModelInterface["currencyCode"]
    ) => Promise<BwModelInterface>;
}
