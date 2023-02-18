import { CreateWalletDto } from "../../../../dtos";
import { WalletModelInterface, WalletRepoInterface } from "../../../db";

export interface WalletServiceInterface {
    createWallet: (createWalletDto: CreateWalletDto) => Promise<WalletModelInterface>;
}

export interface WalletServiceDependencies {
    repo: WalletRepoInterface;
}
